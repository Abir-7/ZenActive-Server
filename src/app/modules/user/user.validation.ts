import { z } from "zod";
import {
  ActivityLevel,
  DietType,
  Gender,
  Injury,
  MedicalCondition,
  MovementDifficulty,
  PrimaryGoals,
} from "./user.interface";

export const zodCreateUserSchema = z
  .object({
    body: z.object({
      email: z
        .string({ required_error: "Email is required." })
        .email("Please provide a valid email address."),
      password: z
        .string({ required_error: "Password is required." })
        .min(6, "Password must be at least 6 characters long."),
      confirm_password: z
        .string({ required_error: "Confirm Password is required." })
        .min(6, "Confirm Password must be at least 6 characters long."),

      fcmToken: z
        .string({ required_error: "fcmToeken is required." })
        .min(6, "fcmToeken must be at least 6 characters long."),
    }),
  })
  .strict();

export const zodUserUpdateSchema = z
  .object({
    body: z.object({
      medicalCondition: z
        .enum(Object.values(MedicalCondition) as [string, ...string[]])
        .optional(),
      movementDifficulty: z
        .enum(Object.values(MovementDifficulty) as [string, ...string[]])
        .optional(),
      injury: z.enum(Object.values(Injury) as [string, ...string[]]).optional(),
      activityLevel: z
        .enum(Object.values(ActivityLevel) as [string, ...string[]])
        .optional(),
      diet: z.enum(Object.values(DietType) as [string, ...string[]]).optional(),
      primaryGoal: z
        .enum(Object.values(PrimaryGoals) as [string, ...string[]])
        .optional(),
      weight: z.number().min(1, "Weight must be a positive number").optional(),
      height: z.number().min(1, "Height must be a positive number").optional(),
      gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),

      dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        })
        .transform((val) => new Date(val))
        .optional(), // Converts the string to a Date

      name: z
        .object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
        })
        .optional(),
    }),
  })
  .strict();

// verify user
export const zodVerifyEmailSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    code: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .refine((val: any) => !isNaN(val), {
        message: "One time code is required",
      }),
  }),
});
