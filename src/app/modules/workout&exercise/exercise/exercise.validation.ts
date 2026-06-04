import { z } from "zod";

export const zodExerciseSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    sets: z.number({
      required_error: "Sets is required",
    }),
    reps: z.number({
      required_error: "Reps is required",
    }),
    restTime: z.number({
      required_error: "Rest time is required",
    }),
    points: z.number({
      required_error: "Points is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    goal: z.string({
      required_error: "Goal is required",
    }),
    duration: z.number({
      required_error: "Duration is required",
    }),
    about: z.string({
      required_error: "About is required",
    }),
    isPremium: z.boolean().optional(),
  }),
});
