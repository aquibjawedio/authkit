import { prisma } from "../config/prisma.js";
import {
  GetMeDTO,
  GetMyAllSessionDTO,
  DeleteMyAllSessionDTO,
  GetMySessionByIdDTO,
  DeleteMySessionByIdDTO,
  GetUserByIdDTO,
  DeleteUserByIdDTO,
} from "../schemas/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { logger } from "../utils/logger.js";
import { sanitizeSession, sanitizeUser } from "../utils/sanitize.js";

export const getMeService = async ({ userId }: GetMeDTO) => {
  logger.info(`Attempt To Get User Info : Finding user with id - ${userId}`);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.error(`Failed To Get User Info : User with id - ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`Successfully Fetched User Info : User with id - ${userId} found`);

  return sanitizeUser(user);
};

export const updateMyAvatarService = async ({
  userId,
  avatarFilePath,
}: {
  userId: string;
  avatarFilePath: string;
}) => {
  logger.info(`Attempt To Update User Avatar : Updating avatar for user with id - ${userId}`);

  const safeUrl = await uploadOnCloudinary(avatarFilePath);

  if (!safeUrl) {
    logger.error(
      `Failed To Update User Avatar : Error uploading avatar for user with id - ${userId}`
    );
    throw new ApiError(500, "Error uploading avatar");
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl: safeUrl,
    },
  });

  if (!user) {
    logger.error(`Failed To Update User Avatar : User with id - ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`Successfully Updated User Avatar : Avatar updated for user with id - ${userId}`);
  return sanitizeUser(user);
};

// Session Management Services

export const getMyAllSessionsService = async ({ userId }: GetMyAllSessionDTO) => {
  logger.info(`Attempt To Get User Sessions : Finding sessions for user with id - ${userId}`);

  const sessions = await prisma.session.findMany({
    where: {
      userId: userId,
      isValid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!sessions || sessions.length === 0) {
    logger.warn(`No sessions found for user with id - ${userId}`);
    return [];
  }

  logger.info(
    `Successfully Fetched User Sessions : Found ${sessions.length} sessions for user with id - ${userId}`
  );

  return sessions.map(sanitizeSession);
};

export const deleteMyAllSessionsService = async ({ userId, sessionId }: DeleteMyAllSessionDTO) => {
  logger.info(
    `Attempt To Delete All Sessions : Deleting all sessions for user with id - ${userId}`
  );

  const result = await prisma.session.updateMany({
    where: {
      userId: userId,
      isValid: true,
      id: {
        not: sessionId,
      },
    },
    data: {
      isValid: false,
    },
  });

  if (result.count === 0) {
    logger.warn(`No sessions found to delete for user with id - ${userId}`);
    return "No sessions found to delete";
  }

  logger.info(
    `Successfully Deleted All Sessions : Deleted ${result.count} sessions for user with id - ${userId}`
  );
  return `${result.count} sessions deleted successfully`;
};

export const getMySessionByIdService = async ({ userId, sessionId }: GetMySessionByIdDTO) => {
  logger.info(
    `Attempt To Get User Session By ID : Finding session with id - ${sessionId} for user with id - ${userId}`
  );

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
      userId: userId,
      isValid: true,
    },
  });

  if (!session) {
    logger.error(`Failed To Get User Session : Session with id - ${sessionId} not found`);
    throw new ApiError(404, "Session not found");
  }

  logger.info(`Successfully Fetched User Session : Session with id - ${sessionId} found`);

  return sanitizeSession(session);
};

export const deleteMySessionByIdService = async ({ userId, sessionId }: DeleteMySessionByIdDTO) => {
  logger.info(
    `Attempt To Delete User Session By ID : Deleting session with id - ${sessionId} for user with id - ${userId}`
  );

  const result = await prisma.session.updateMany({
    where: {
      id: sessionId,
      userId: userId,
      isValid: true,
    },
    data: {
      isValid: false,
    },
  });

  if (result.count === 0) {
    logger.error(
      `Failed To Delete User Session: Session with id - ${sessionId} not found or already revoked`
    );
    throw new ApiError(404, "Session not found or already revoked");
  }

  logger.info(`Successfully Deleted User Session : Session with id - ${sessionId} deleted`);
  return "Session deleted successfully";
};

// Mod and Admin Services
export const getAllUsersService = async () => {
  logger.info("Attempt To Get All Users : Fetching all users");

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!users || users.length === 0) {
    logger.warn("No users found");
    return [];
  }

  logger.info(`Successfully Fetched All Users : Found ${users.length} users`);
  return users.map(sanitizeUser);
};

export const getUserByIdService = async ({ userId }: GetUserByIdDTO) => {
  logger.info(`Attempt To Get User By ID : Finding user with id - ${userId}`);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.error(`Failed To Get User By ID : User with id - ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`Successfully Fetched User By ID : User with id - ${userId} found`);
  return sanitizeUser(user);
};

// Admin Only Services

export const deleteUserByIdService = async ({ userId }: DeleteUserByIdDTO) => {
  logger.info(`Attempt To Delete User : Deleting user with id - ${userId}`);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
  });

  if (!user) {
    logger.error(`Failed To Delete User : User with id - ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  if (user.isDeleted) {
    logger.warn(`User with id - ${userId} is already deleted`);
    return "User already deleted";
  }

  const sessions = await prisma.session.updateMany({
    where: {
      userId: userId,
      isValid: true,
    },
    data: {
      isValid: false,
    },
  });
  if (sessions.count > 0) {
    logger.info(`Revoked ${sessions.count} active sessions for user with id - ${userId}`);
  }

  logger.info(`Successfully Deleted User : User with id - ${userId} deleted`);

  return "User deleted successfully";
};
