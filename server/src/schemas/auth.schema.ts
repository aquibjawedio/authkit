import { string, z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "FullName is required"),
  username: z.string().trim().lowercase().min(5, "Username must of atleast 5 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().trim().min(8, "Password must be atleast 8 characters"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().trim().min(8, "Password must be atleast 8 characters"),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export interface SessionDTO {
  ipAddress: string;
  userAgent: string;
  device: string;
  os: string;
  browser: string;
}

export const refreshAccessTokenSchema = z.object({
  token: z.string().trim().min(1, "Refresh token missing"),
  incomingIp: z.string().trim().min(1, "Incoming IP address is required"),
  userAgent: z.string().trim().min(1, "User agent is required"),
});

export type RefreshDTO = z.infer<typeof refreshAccessTokenSchema>;
