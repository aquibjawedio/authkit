import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteMyAllSessionSchema,
  deleteMySessionByIdSchema,
  getMeSchema,
  getMyAllSessionSchema,
  getMySessionByIdSchema,
} from "../schemas/user.schema.js";
import {
  deleteMyAllSessionsService,
  deleteMySessionByIdService,
  getMeService,
  getMyAllSessionsService,
  getMySessionByIdService,
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
