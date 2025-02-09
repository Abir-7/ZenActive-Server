import { z } from "zod";

export const zodLoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long."),
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

export const zodResendCodeSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Give original Email." }),
  }),
});
export const zodUpdatePasswordSchema = z.object({
  body: z.object({
    old_password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long."),
    new_password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long."),
    confirm_password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long."),
  }),
});
