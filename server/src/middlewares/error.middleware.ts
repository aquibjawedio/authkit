import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    if (env.NODE_ENV === "development") {
      logger.error("ZodError:", err);
    }

    return res.status(400).json({
      statusCode: 400,
      success: false,
      name: err.name,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    if (env.NODE_ENV === "development") {
      logger.error("ApiError:", err.message, { stack: err.stack });
    }

    return res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      success: false,
      name: err.name,
      message: err.message || "Something went wrong",
      errors: Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : [],
    });
  }

  if (env.NODE_ENV === "development") {
    logger.error("Unhandled error:", err);
  }

  const serializedError = err instanceof Error ? { message: err.message } : { info: String(err) };

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Internal Server Error",
    errors: [serializedError],
  });
};

export { errorHandler };
