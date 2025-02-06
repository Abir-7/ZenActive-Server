import { z } from "zod";

const TimeIntervalSchema = z.enum([
  "day",
  "week",
  "month",
  "year",
  "half-year",
]);

export const zodPackageSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    features: z.array(z.string()).min(1, "Description is required"),
    unitAmount: z.number().min(0, "Unit amount must be a positive number"),
    interval: TimeIntervalSchema,
  }),
});
