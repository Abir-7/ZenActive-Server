import { ZodError } from "zod";

export const handleZodError = (err: ZodError) => {
  const statusCode = 400; // Bad Request for validation errors
  const message = "Validation failed!";

  // Map through Zod error issues and format them
  const errors = err.errors.map((e) => ({
    message: e.message,
    path: e.path.join("."),
  }));

  return { statusCode, message, errors };
};
