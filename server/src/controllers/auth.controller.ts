import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginSchema,
  logoutSchema,
  refreshAccessTokenSchema,
  registerSchema,
  SessionDTO,
  verifyEmailSchema,
} from "../schemas/auth.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  loginService,
  logoutService,
  refreshAccessTokenService,
  registerService,
  VerifyEmailService,
} from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = registerSchema.safeParse(req.body);

  const user = await registerService(data);

  res.status(201).json(new ApiResponse(201, "User registered successfully", { user }));
});

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = verifyEmailSchema.safeParse({ token: req.params.token });

  const user = await VerifyEmailService(data);

  return res.status(200).json(new ApiResponse(200, "Email verification successfull", { user }));
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = loginSchema.safeParse(req.body);

  if (req.cookies.accessToken && req.cookies.refreshToken) {
    logger.warn(`Login Attempt Failed: User is already logged in with email - ${data.email}`);
    throw new ApiError(403, "User is already logged in");
  }

  if (req.cookies.refreshToken) {
    logger.warn(`Login Attempt Failed: User is already logged in with email - ${data.email}`);
    throw new ApiError(403, "User is already logged in");
  }

  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const { user, accessToken, accessTokenOptions, refreshToken, refreshTokenOptions } =
    await loginService(data, ipAddress, userAgent);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "User logged in successfully", { user }));
});

export const refreshAccessTokenController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) {
    logger.error("Refreshing Failed : Missing refresh token");
    throw new ApiError(401, "Missing refresh token while refreshing.");
  }

  const { data } = refreshAccessTokenSchema.safeParse({
    token: req.cookies.refreshToken,
  });

  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const { user, accessToken, accessTokenOptions, refreshToken, refreshTokenOptions } =
    await refreshAccessTokenService(data, ipAddress, userAgent, res);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "Access token refreshed successfully", { user }));
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = logoutSchema.safeParse({
    refreshToken: req.cookies?.refreshToken,
  });

  const { options } = await logoutService(data);

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});
