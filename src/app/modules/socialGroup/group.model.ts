import { model, Schema } from "mongoose";
import { groupTypes, IGroup } from "./group.interface";

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: groupTypes, required: true },
    goal: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Group = model<IGroup>("Group", GroupSchema);
