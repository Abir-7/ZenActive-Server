import { z } from "zod";

export const zodBlockSchema = z.object({
  body: z.object({
    blockedUserId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"), //
  }),
});
