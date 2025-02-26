import { z } from "zod";

export const zodCommentSchema = z.object({
  body: z.object({
    postId: z.string().regex(/^[a-fA-F0-9]{24}$/),
    comment: z.string().min(1),
  }),
});

export const zodVideoCommentSchema = z.object({
  body: z.object({
    videoId: z.string().regex(/^[a-fA-F0-9]{24}$/),
    comment: z.string().min(1),
  }),
});
