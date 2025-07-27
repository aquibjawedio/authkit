import { prisma } from "../config/prisma.js";
import {
  GetMeDTO,
  GetMyAllSessionDTO,
  DeleteMyAllSessionDTO,
  GetMySessionByIdDTO,
  DeleteMySessionByIdDTO,
} from "../schemas/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
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

// Session Management Services

export const getMyAllSessionsService = async ({ userId }: GetMyAllSessionDTO) => {
  logger.info(`Attempt To Get User Sessions : Finding sessions for user with id - ${userId}`);

  const sessions = await prisma.session.findMany({
    where: {
      userId: userId,
      isRevoked: false,
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
      isRevoked: false,
      id: {
        not: sessionId,
      },
    },
    data: {
      isRevoked: true,
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
      isRevoked: false,
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
      isRevoked: false,
    },
    data: {
      isRevoked: true,
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
