import { Schema, model, Types } from "mongoose";
import { IFriend } from "./friendlist.interface";

const friendSchema = new Schema<IFriend>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Friend = model<IFriend>("Friend", friendSchema);

export default Friend;
