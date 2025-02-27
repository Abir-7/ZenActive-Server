import { z } from "zod";

export const zodLikeSchema = z.object({
  body: z.object({
    postId: z.string().optional(),
  }),
});
