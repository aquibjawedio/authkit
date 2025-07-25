import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { healthSchema } from "../schemas/health.schema.js";
import { healthService } from "../services/health.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const healthController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = healthSchema.safeParse({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });

  const result = await healthService(data);
  return res.status(200).json(new ApiResponse(200, "Health Check Passed", result));
});
