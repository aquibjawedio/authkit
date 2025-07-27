import { z } from "zod";

export const getMeSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export type GetMeDTO = z.infer<typeof getMeSchema>;

export const getMyAllSessionSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export type GetMyAllSessionDTO = z.infer<typeof getMyAllSessionSchema>;

export const deleteMyAllSessionSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required").optional(),
});

export type DeleteMyAllSessionDTO = z.infer<typeof deleteMyAllSessionSchema>;

export const getMySessionByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required"),
});

export type GetMySessionByIdDTO = z.infer<typeof getMySessionByIdSchema>;

export const deleteMySessionByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  sessionId: z.string().trim().min(1, "Session ID is required"),
});

export type DeleteMySessionByIdDTO = z.infer<typeof deleteMySessionByIdSchema>;

// Mods and Admins

export const getUserByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export type GetUserByIdDTO = z.infer<typeof getUserByIdSchema>;

export const restrictUserByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED", "BANNED"]),
});
export type RestrictUserByIdDTO = z.infer<typeof restrictUserByIdSchema>;

export const deleteUserByIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});
export type DeleteUserByIdDTO = z.infer<typeof deleteUserByIdSchema>;
