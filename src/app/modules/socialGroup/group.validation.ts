import { z } from "zod";

export const zodGroupSchema = z.object({
  body: z.object({
    name: z.string().nonempty({ message: "Name cannot be empty" }),
    type: z.string().nonempty({ message: "Type cannot be empty" }),
    goal: z.string().nonempty({ message: "Goal cannot be empty" }),
  }),
});

export const zodUpdateGroupSchema = z.object({
  body: z.object({
    name: z.string().nonempty({ message: "Name cannot be empty" }).optional(),
    type: z.string().nonempty({ message: "Type cannot be empty" }).optional(),
    goal: z.string().nonempty({ message: "Goal cannot be empty" }).optional(),
  }),
});
