import bcrypt from "bcryptjs";
import { User } from "../generated/prisma/index.js";
import crypto from "crypto";

export const comparePassword = async (password: string, user: User) => {
  return bcrypt.compare(password, user.password);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return { unHashedToken, hashedToken, tokenExpiry };
};

export const createCryptoHash = (value: string) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};
