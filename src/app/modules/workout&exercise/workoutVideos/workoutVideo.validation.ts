import { z } from "zod";

export const zodWorkoutVideoSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
  }),
});
