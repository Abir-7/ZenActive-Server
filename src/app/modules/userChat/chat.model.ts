import { model, Schema } from "mongoose";
import { IChat } from "./chat.interface";

const chatSchema = new Schema<IChat>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    seenBy: [
      {
        type: Schema.Types.ObjectId,

        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat>("Chat", chatSchema);
