import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import env from "../config/env";
import { AppError, ConflictError } from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isDev = env.nodeEnv === "development";

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(isDev && err.details && { details: err.details }),
    });
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors = err.issues
      .map((i) => `${i.path.join(".")} - ${i.message}`)
      .join(", ");
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation Error",
      errors,
    });
  }

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Duplicate entry
    if (err.code === "P2002") {
      const conflictErr = new ConflictError(
        "Duplicate value detected in database",
        err.meta
      );
      return res.status(conflictErr.statusCode).json({
        success: false,
        statusCode: conflictErr.statusCode,
        message: conflictErr.message,
        ...(isDev && { details: conflictErr.details }),
      });
    }

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
      ...(isDev && { details: err.meta }),
    });
  }

  // Other unhandled errors (default 500)
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: isDev
      ? err.message
      : "Something went wrong. Please try again later.",
  });
};

export default globalErrorHandler;
