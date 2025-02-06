import { z } from "zod";

export const zodFriendListSchema = z.object({
  body: z.object({
    friendId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  }),
});
