import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema, verifyEmailSchema } from "../schemas/auth.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerService, VerifyEmailService } from "../services/auth.service.js";

/* 
  Register user with fullname, user name , email and password.
*/
export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = registerSchema.safeParse(req.body);

  const user = await registerService(data);

  res.status(201).json(new ApiResponse(201, "User registered successfully", { user }));
});

/* 
  After registering user, now verify email sent on email.
*/
export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = verifyEmailSchema.safeParse({ token: req.params.token });

  const user = await VerifyEmailService(data);

  return res.status(200).json(new ApiResponse(200, "Email verification successfull", { user }));
});

/* 
  Now user can login with the same credentials.
*/
export const loginController = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, "User logged in successfully"));
});
