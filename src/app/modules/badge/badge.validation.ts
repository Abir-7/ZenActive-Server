import { z } from "zod";

export const zodBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    points: z.number().min(0, "Points must be a positive number"),
  }),
});

export const zodUpdateBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    points: z.number().min(0, "Points must be a positive number").optional(),
  }),
});
