import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteMyAllSessionSchema,
  deleteMySessionByIdSchema,
  deleteUserByIdSchema,
  getMeSchema,
  getMyAllSessionSchema,
  getMySessionByIdSchema,
  getUserByIdSchema,
} from "../schemas/user.schema.js";
import {
  deleteMyAllSessionsService,
  deleteMySessionByIdService,
  deleteUserByIdService,
  getAllUsersService,
  getMeService,
  getMyAllSessionsService,
  getMySessionByIdService,
  getUserByIdService,
} from "../services/user.service.js";

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getMeSchema.safeParse({ userId: req.user?.id });

  const user = await getMeService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, "User information fetched successfully", { user }));
});

export const updateMeController = asyncHandler(async (req: Request, res: Response) => {});

export const updateMyEmailController = asyncHandler(async (req: Request, res: Response) => {});

export const updateMyPasswordController = asyncHandler(async (req: Request, res: Response) => {});

export const updateMyAvatarController = asyncHandler(async (req: Request, res: Response) => {});

// For session management
export const getMyAllSessionController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getMyAllSessionSchema.safeParse({ userId: req.user?.id });

  const sessions = await getMyAllSessionsService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, "User sessions fetched successfully", { sessions }));
});

export const deleteMyAllSessionController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = deleteMyAllSessionSchema.safeParse({
    userId: req.user?.id,
    sessionId: req.user.sessionId,
  });

  const message = await deleteMyAllSessionsService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, message || "All sessions deleted successfully", {}));
});

export const getMySessionByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getMySessionByIdSchema.safeParse({
    userId: req.user?.id,
    sessionId: req.params.sessionId,
  });

  const session = await getMySessionByIdService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, "User information fetched successfully", { session }));
});

export const deleteMySessionByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = deleteMySessionByIdSchema.safeParse({
    userId: req.user?.id,
    sessionId: req.params.sessionId,
  });

  if (data.sessionId === req.user?.sessionId) {
    return res.status(400).json(new ApiResponse(400, "Cannot delete current session", {}));
  }

  const message = await deleteMySessionByIdService(data);

  return res.status(200).json(new ApiResponse(200, message || "Session deleted successfully", {}));
});

/* 
  Controllers for user management that can be accessed by both admin and users
*/
export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const users = await getAllUsersService();
  return res.status(200).json(new ApiResponse(200, "All users fetched successfully", { users }));
});

export const getUserByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getUserByIdSchema.safeParse({ userId: req.params.userId });

  const user = await getUserByIdService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, "User information fetched successfully", { user }));
});

/* 
  Only admin controllers for user management
*/
export const deleteUserByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = deleteUserByIdSchema.safeParse({ userId: req.params.userId });

  if (data.userId === req.user?.id) {
    return res.status(400).json(new ApiResponse(400, "Cannot delete your own account", {}));
  }

  const message = await deleteUserByIdService(data);

  return res.status(200).json(new ApiResponse(200, message || "User deleted successfully", {}));
});
