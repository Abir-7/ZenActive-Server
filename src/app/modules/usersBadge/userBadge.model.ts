import { model, Schema } from "mongoose";

const userBadgeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  badgeId: {
    type: Schema.Types.ObjectId,
    ref: "Badge",
    required: true,
  },
});

export const UserBadge = model("UserBadge", userBadgeSchema);
