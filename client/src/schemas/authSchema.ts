import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(3, "Fullname must be at least 3 characters long"),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(16, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export type RegisterFormDTO = z.infer<typeof registerSchema>;
export type LoginFormDTO = z.infer<typeof loginSchema>;
