import { model, Schema } from "mongoose";
import { IUserGroup } from "./userGroup.interface";

const UserGroupSchema = new Schema<IUserGroup>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    previousTotalPost: { type: Number, default: 0 },
    newPost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Export the model
export const UserGroup = model<IUserGroup>("UserGroup", UserGroupSchema);
