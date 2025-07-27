import { Session, User } from "../generated/prisma/index.js";

export const sanitizeUser = ({
  id,
  fullname,
  username,
  email,
  role,
  isEmailVerified,
  status,
  avatarUrl,
  bio,
  lastLogin,
  socialMedia,
  createdAt,
  updatedAt,
}: User) => {
  return {
    id,
    fullname,
    username,
    email,
    role,
    isEmailVerified,
    status,
    avatarUrl,
    bio,
    lastLogin,
    socialMedia,
    createdAt,
    updatedAt,
  };
};

export const sanitizeSession = ({ id, userId, city, browser, createdAt, updatedAt }: Session) => {
  return {
    id,
    userId,
    city,
    browser,
    createdAt,
    updatedAt,
  };
};
