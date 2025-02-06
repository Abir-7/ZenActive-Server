import { z } from "zod";

export const zodChatSchema = z.object({
  body: z.object({
    senderId: z.string({
      required_error: "Sender ID is required",
    }),
    receiverId: z.string({
      required_error: "Receiver ID is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
  }),
});
