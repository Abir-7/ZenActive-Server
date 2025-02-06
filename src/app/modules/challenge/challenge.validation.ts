import { z } from "zod";

// Zod schema for creating a challenge (all fields required)
export const zodChallengeSchema = z.object({
  body: z.object({
    challengeName: z.string().min(1, { message: "Challenge name is required" }),
    duration: z.string().min(1, { message: "Duration is required" }),
    rewardPoints: z
      .number()
      .positive({ message: "Reward points must be a positive number" }),
    goal: z.string().min(1, { message: "Goal is required" }),
  }),
});

// Zod schema for updating a challenge (all fields optional)
export const zodUpdateChallengeSchema = z.object({
  body: z.object({
    challengeName: z
      .string()
      .min(1, { message: "Challenge name must be a non-empty string" })
      .optional(),
    duration: z
      .string()
      .min(1, { message: "Duration must be a non-empty string" })
      .optional(),
    rewardPoints: z
      .number()
      .positive({ message: "Reward points must be a positive number" })
      .optional(),
    goal: z
      .string()
      .min(1, { message: "Goal must be a non-empty string" })
      .optional(),
  }),
});
