import { z } from "zod";

export const zodPostSchema = z.object({
  body: z.object({
    text: z.string().min(1),
  }),
});
