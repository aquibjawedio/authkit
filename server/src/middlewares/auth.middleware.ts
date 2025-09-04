import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { clearCookieOptions } from "../config/cookie.js";
import { verifyJWTAccessToken } from "../utils/jwt.js";
import { AppUser } from "../types/global.js";
import { UserRole } from "../generated/prisma/index.js";

export const isLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    logger.info(`Refresh token is missing! Unauthorized request`);
    res
      .clearCookie("accessToken", clearCookieOptions())
      .clearCookie("refreshToken", clearCookieOptions());
    throw new ApiError(401, "Unauthorized! Refresh token is missing");
  }

  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    logger.warn(`Access token is invalid or expired`);
    throw new ApiError(401, "ACCESS TOKEN EXPIRED");
  }

  let decoded: AppUser;

  try {
    const verifiedData = verifyJWTAccessToken(accessToken);
    if (typeof verifiedData === "string") {
      throw new Error("Invalid token payload");
    }
    decoded = verifiedData as AppUser;
  } catch (err) {
    logger.warn("Access token verification failed.");
    throw new ApiError(401, "Invalid access token.", err);
  }
  req.user = decoded;

  next();
});

export const isModOrAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.MOD && req.user?.role !== UserRole.ADMIN) {
      console.log("User role:", req.user?.role);
      logger.warn(`User with ID ${req.user?.id} is not authorized to access this resource`);
      throw new ApiError(403, "Forbidden! You do not have permission to access this resource");
    }
    next();
  }
);

export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    logger.warn(`User with ID ${req.user?.id} is not authorized to access this resource`);
    throw new ApiError(403, "Forbidden! You do not have permission to access this resource");
  }
  next();
});
