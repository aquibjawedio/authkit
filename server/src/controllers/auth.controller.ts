import { Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginSchema,
  refreshAccessTokenSchema,
  registerSchema,
  SessionDTO,
  verifyEmailSchema,
} from "../schemas/auth.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  loginService,
  refreshAccessTokenService,
  registerService,
  VerifyEmailService,
} from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

/* 
  Register user with fullname, user name , email and password.
*/
export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = registerSchema.safeParse(req.body);

  const user = await registerService(data);

  res.status(201).json(new ApiResponse(201, "User registered successfully", { user }));
});

/* 
  After registering user, now verify email sent on email.
*/
export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = verifyEmailSchema.safeParse({ token: req.params.token });

  const user = await VerifyEmailService(data);

  return res.status(200).json(new ApiResponse(200, "Email verification successfull", { user }));
});

/* 
  Now user can login with the same credentials.
*/
export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = loginSchema.safeParse(req.body);

  if (req.cookies.accessToken && req.cookies.refreshToken) {
    logger.warn(`Login Attempt Failed: User is already logged in with email - ${data.email}`);
    throw new ApiError(403, "User is already logged in with this email");
  }

  if (req.cookies.refreshToken) {
    logger.warn(`Login Attempt Failed: User is already logged in with email - ${data.email}`);
    throw new ApiError(403, "User is already logged in with this email");
  }

  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const ua = UAParser(req.headers["user-agent"]);

  const uaData: SessionDTO = {
    ipAddress,
    userAgent,
    device: ua.device.type || "desktop",
    os: `${ua.os.name} ${ua.os.version}`,
    browser: `${ua.browser.name} ${ua.browser.version}`,
  };

  const { user, accessToken, accessTokenOptions, refreshToken, refreshTokenOptions } =
    await loginService(data, uaData);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "User logged in successfully", { user }));
});

/* 
  Now user can login with the same credentials.
*/
export const refreshAccessTokenController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) {
    logger.error("Refreshing Failed : Missing refresh token");
    throw new ApiError(401, "Missing refresh token while refreshing.");
  }

  const { data } = refreshAccessTokenSchema.safeParse({
    token: req.cookies.refreshToken,
    incomingIp: req.ip || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, accessTokenOptions, refreshToken, refreshTokenOptions } =
    await refreshAccessTokenService(data);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "Access token refreshed successfully", { user }));
});
