import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "FullName is required"),
  username: z.string().trim().lowercase().min(5, "Username must of atleast 5 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().trim().min(8, "Password must be atleast 8 characters"),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().trim().min(8, "Password must be atleast 8 characters"),
});

export interface SessionDTO {
  ipAddress: string;
  userAgent: string;
  device: string;
  os: string;
  browser: string;
}

export const refreshAccessTokenSchema = z.object({
  token: z.string().trim().min(1, "Refresh token missing"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;
export type RefreshDTO = z.infer<typeof refreshAccessTokenSchema>;
export type LogoutDTO = z.infer<typeof logoutSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
