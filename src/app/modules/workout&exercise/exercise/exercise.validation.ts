import { z } from "zod";

export const zodExerciseSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),
    sets: z.number({
      required_error: "Sets is required",
      invalid_type_error: "Sets must be a number",
    }),
    reps: z.number({
      required_error: "Reps is required",
      invalid_type_error: "Reps must be a number",
    }),
    restTime: z.number({
      required_error: "Rest time is required",
      invalid_type_error: "Rest time must be a number",
    }),

    points: z.number({
      required_error: "Points is required",
      invalid_type_error: "Points must be a number",
    }),
  }),
});
