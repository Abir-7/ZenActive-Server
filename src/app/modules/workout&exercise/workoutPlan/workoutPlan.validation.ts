import { z } from "zod";

export const zodWorkoutPlanSchema = z
  .object({
    body: z.object({
      name: z.string().min(1, { message: "Name is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      duration: z
        .number()
        .positive({ message: "Duration must be a positive number" }),
      points: z
        .number()
        .positive({ message: "Reward points must be a positive number" }),
      about: z.string().min(1, { message: "About section is required" }),
    }),
  })
  .strict();

export const zodUpdateWorkoutPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .optional(),
    duration: z
      .number()
      .positive({ message: "Duration must be a positive number" })
      .optional(),
    points: z
      .number()
      .positive({ message: "Reward points must be a positive number" })
      .optional(),
    about: z
      .string()
      .min(1, { message: "About section is required" })
      .optional(),
  }),
});
