import { z } from "zod";

export const zodLoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const zodForgotPassSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
  }),
});
export const zodResetPassSchema = z.object({
  body: z.object({
    new_password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long."),
    confirm_password: z
      .string({ required_error: "Confirm Password is required." })
      .min(6, "Confirm Password must be at least 6 characters long."),
  }),
});
