import { z } from "zod";

export const zodWorkoutSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty({ message: "Name is required and cannot be empty." }),
    description: z
      .string()
      .nonempty({ message: "Description is required and cannot be empty." }),
    exercises: z
      .array(
        z.string().nonempty({ message: "Each exercise ID cannot be empty." })
      )
      .nonempty({ message: "At least one exercise ID is required." }),
    points: z
      .number()
      .positive({ message: "Points must be a positive number." }),
  }),
});
