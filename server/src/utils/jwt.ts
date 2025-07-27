import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface JwtOptionsDTO {
  id: string;
  email: string;
  role: "USER" | "MOD" | "ADMIN";
  sessionId: string;
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED" | "BANNED";
}

export const generateAccessToken = async ({
  id,
  email,
  role,
  sessionId,
  status,
}: JwtOptionsDTO) => {
  return jwt.sign({ id, email, role, sessionId, status }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = async ({
  id,
  email,
  role,
  sessionId,
  status,
}: JwtOptionsDTO) => {
  return jwt.sign({ id, email, role, sessionId, status }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

export const verifyJWTRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
};

export const verifyJWTAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
};
