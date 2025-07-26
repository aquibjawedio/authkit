import { z } from "zod";

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
