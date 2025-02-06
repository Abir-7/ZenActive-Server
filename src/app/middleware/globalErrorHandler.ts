// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";
import { handleMongooseError } from "../errors/mongooseErrorHandler";
import { ZodError } from "zod";
import { handleZodError } from "../errors/zodErrorHandler";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errors: any = [];

  if (err instanceof mongoose.Error) {
    const mongooseError = handleMongooseError(err);
    statusCode = mongooseError.statusCode;
    message = mongooseError.message;
    errors = mongooseError.errors;
  } else if (err?.name == "ValidationError") {
    const mongooseError = handleMongooseError(err);
    statusCode = mongooseError.statusCode;
    message = mongooseError.message;
    errors = mongooseError.errors;
  } else if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.errors;
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please login again.";
    errors = [
      {
        path: "token",
        message: message,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errors: errors.length ? errors : undefined,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
