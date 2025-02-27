import { z } from "zod";

export const zodStartWorkoutPlanSchema = z.object({
  body: z.object({
    workoutPlanId: z
      .string()
      .min(1, { message: "Workout Plan ID is required" }),
  }),
});
