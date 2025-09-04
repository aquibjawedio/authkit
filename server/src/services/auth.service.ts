import { UAParser } from "ua-parser-js";

import { prisma } from "../config/prisma.js";
import {
  googleOAuthUser,
  LoginDTO,
  LogoutDTO,
  RefreshDTO,
  RegisterDTO,
  VerifyEmailDTO,
} from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";
import {
  comparePassword,
  createCryptoHash,
  generateTemporaryToken,
  hashPassword,
} from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { sendEmail } from "../utils/sendEmail.js";
import { emailVerificationMailGenContent } from "../utils/emailTemplates.js";
import { env } from "../config/env.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { cookieOptions } from "../config/cookie.js";
import { Response } from "express";
import { Profile } from "passport";

export const registerService = async ({ fullname, username, email, password }: RegisterDTO) => {
  logger.info(`Attempt to register user : email - ${email}`);

  const userByEmail = await prisma.user.findUnique({ where: { email } });
  if (userByEmail) {
    logger.warn(`Registration failed: User already exists with Email - ${email}`);
    throw new ApiError(409, "User already exists with this email");
  }

  const userByUsername = await prisma.user.findUnique({ where: { username } });
  if (userByUsername) {
    logger.warn(`Registration failed: User already exists with Username - ${username}`);
    throw new ApiError(409, "User already exists with this username");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword,
    },
  });

  logger.info(`User Created: Now sending email at - ${email}`);

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  sendEmail({
    email,
    subject: "Verify Email",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  logger.info(`Register Attempt Successfull : User registed and email sent at - ${email} `);
  return sanitizeUser(updateUser);
};

export const VerifyEmailService = async ({ token }: VerifyEmailDTO) => {
  logger.info(`Attemp To Verify User Email : Checking if user exists for token - ${token}`);

  const newHashedToken = createCryptoHash(token);

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: newHashedToken,
    },
  });

  if (!user) {
    logger.error(`Invalid Request : User not found for this token - ${token}`);
    throw new ApiError(400, "User not found with this token");
  }

  if (user.isEmailVerified) {
    logger.warn(`Invalid request : User is already verified with email - ${user.email}`);
    throw new ApiError(403, "User email is already verified");
  }

  if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
    logger.warn(`Veification Failed : Token expired for - ${user.email}`);
    const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

    const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

    sendEmail({
      email: user.email,
      subject: "Verify Email",
      mailGenContent: emailVerificationMailGenContent(user.fullname, verificationUrl),
    });

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: tokenExpiry,
      },
    });

    throw new ApiError(401, "Token expired. A new verification link has been sent to your email.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      isEmailVerified: true,
      emailVerificationExpiry: null,
      emailVerificationToken: null,
    },
  });

  logger.info(`Verification Successfull : User verified with email - ${user.email}`);

  return sanitizeUser(updatedUser);
};

export const loginService = async (
  { email, password }: LoginDTO,
  ipAddress: string,
  userAgent: string
) => {
  logger.info(`Attempt To Login : Finding user with email - ${email}`);
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    logger.error(`Login Failed : User doesn't exists with email - ${email}`);
    throw new ApiError(401, "User not found with this email");
  }

  if (!user.isEmailVerified) {
    logger.warn(`Login Failed : User email is not verified - ${email}`);
    throw new ApiError(403, "User email is not verified");
  }

  if (user.isDeleted) {
    logger.warn(`Login Failed : User is deleted - ${email}`);
    throw new ApiError(403, "User is deleted");
  }

  const isPasswordCorrect = await comparePassword(password, user);

  if (!isPasswordCorrect) {
    logger.error(`Login Failed : Incorrect password for user - ${email}`);
    throw new ApiError(401, "Incorrect password");
  }

  const ua = UAParser(userAgent);

  const session = await prisma.session.create({
    data: {
      refreshToken: null,
      userAgent,
      ipAddress,
      device: ua.device.model,
      os: ua.os.name + " " + ua.os.version,
      browser: ua.browser.name + " " + ua.browser.version,
      isValid: false,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const accessTokenOptions = cookieOptions(15);

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const refreshTokenOptions = cookieOptions(60 * 24 * 7);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refreshToken: createCryptoHash(refreshToken),
      isValid: true,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  logger.info(`Login Successfull : User logged in with email - ${email}`);

  return {
    user: sanitizeUser(updatedUser),
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  };
};

export const refreshAccessTokenService = async (
  { token }: RefreshDTO,
  ipAddress: string,
  userAgent: string,
  res: Response
) => {
  logger.info(`Attemp To Refresh Token : Refresing token - ${token}`);
  const hashedToken = createCryptoHash(token);

  const session = await prisma.session.findUnique({
    where: {
      refreshToken: hashedToken,
    },
  });

  if (!session) {
    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));
    logger.warn(`Possible Token Replay Detected: Refresh token not found or reused - ${token}`);
    throw new ApiError(401, "Invalid or expired refresh token. Please log in again.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    logger.error(`Refreshing Token Failed : User not found with session id - ${session.id}`);
    throw new ApiError(401, "User not found, please login again.");
  }

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const accessTokenOptions = cookieOptions(15);

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const refreshTokenOptions = cookieOptions(60 * 24 * 7);

  const ua = UAParser(userAgent);
  console.log("UA Data: ", ua);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refreshToken: createCryptoHash(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ipAddress,
      userAgent,
      device: ua.device.model,
      os: ua.os.name + " " + ua.os.version,
      browser: ua.browser.name + " " + ua.browser.version,
      isValid: true,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  logger.info(`Refreshing Token Successfull : User refreshed token with email - ${user.email}`);

  return {
    user: sanitizeUser(updatedUser),
    accessToken,
    accessTokenOptions,
    refreshToken,
    refreshTokenOptions,
  };
};

export const logoutService = async ({ refreshToken }: LogoutDTO) => {
  logger.info(`Attempt To Logout : Logging out user with access token - ${refreshToken}`);

  const hashedToken = createCryptoHash(refreshToken);

  const session = await prisma.session.findUnique({
    where: {
      refreshToken: hashedToken,
    },
  });

  if (!session) {
    logger.error(`Logout Failed : Session not found for token - ${refreshToken}`);
    throw new ApiError(401, "Session not found. Please log in again.");
  }

  if (session.expiresAt && new Date() > session.expiresAt) {
    logger.warn(`Logout Failed : Session expired or revoked for token - ${refreshToken}`);
    throw new ApiError(403, "Session expired or revoked. Please log in again.");
  }

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      isValid: false,
      refreshToken: null,
    },
  });

  logger.info(`Logout Successfull : User logged out with access token - ${refreshToken}`);
  return { options: cookieOptions(0) };
};

export const googleAuthCallbackService = async (profile: googleOAuthUser) => {
  let user = await prisma.user.findUnique({
    where: {
      email: profile.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        fullname: profile.fullName,
        username: profile.email.split("@")[0] + Math.floor(Math.random() * 1000),
        avatarUrl: profile.avatar,
        isEmailVerified: true,
      },
    });
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      isValid: true,
    },
  });

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const accessTokenOptions = cookieOptions(15);

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });
  const refreshTokenOptions = cookieOptions(60 * 24 * 7);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refreshToken: createCryptoHash(refreshToken),
      isValid: true,
    },
  });

  return { accessToken, refreshToken, accessTokenOptions, refreshTokenOptions };
};
