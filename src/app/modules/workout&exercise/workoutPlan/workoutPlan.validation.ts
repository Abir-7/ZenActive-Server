import { z } from "zod";

export const zodWorkoutPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Title is required" }),
    duration: z
      .number()
      .positive({ message: "Duration must be a positive number" }),
    workouts: z.array(
      z.string().min(1, { message: "Exercise name is required" })
    ),
    points: z
      .number()
      .positive({ message: "Reward points must be a positive number" }),

    isDeleted: z.boolean().optional().default(false),
  }),
});

export const zodUpdateWorkoutPlanSchema = z
  .object({
    body: z.object({
      name: z.string().min(1, { message: "Title is required" }).optional(),
      duration: z
        .number()
        .positive({ message: "Duration must be a positive number" })
        .optional(),
      workouts: z
        .array(z.string().min(1, { message: "Exercise name is required" }))
        .optional(),
      points: z
        .number()
        .positive({ message: "Reward points must be a positive number" })
        .optional(),

      isDeleted: z.boolean().optional(),
    }),
  })
  .optional();
