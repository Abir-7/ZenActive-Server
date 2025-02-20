import { Schema, model, Types } from "mongoose";
import { IUserConnection, status } from "./friendlist.interface";

const friendSchema = new Schema<IUserConnection>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: status,
      default: null,
    },
    statusChangeBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },

  { timestamps: true }
);

const UserConnection = model<IUserConnection>("UserConnection", friendSchema);

export default UserConnection;
