import { z } from "zod";

export const getMeSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getMyAllSessionSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const deleteMyAllSessionSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required").optional(),
});

export const getMySessionByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required"),
});

export const deleteMySessionByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required"),
});

// Mods and Admins

export const getUserByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const deleteUserByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export type GetMeDTO = z.infer<typeof getMeSchema>;
export type GetMyAllSessionDTO = z.infer<typeof getMyAllSessionSchema>;
export type DeleteMyAllSessionDTO = z.infer<typeof deleteMyAllSessionSchema>;
export type GetMySessionByIdDTO = z.infer<typeof getMySessionByIdSchema>;
export type DeleteMySessionByIdDTO = z.infer<typeof deleteMySessionByIdSchema>;
export type GetUserByIdDTO = z.infer<typeof getUserByIdSchema>;
export type DeleteUserByIdDTO = z.infer<typeof deleteUserByIdSchema>;
