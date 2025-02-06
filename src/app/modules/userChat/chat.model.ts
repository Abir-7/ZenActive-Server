import { model, Schema } from "mongoose";
import { IChat } from "./chat.interface";

const chatSchema = new Schema<IChat>(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat>("Chat", chatSchema);
