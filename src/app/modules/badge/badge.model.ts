import { model, Schema } from "mongoose";
import { IBadge } from "./badge.interface";

const BadgeSchema: Schema = new Schema<IBadge>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    points: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Badge = model<IBadge>("Badge", BadgeSchema);

export default Badge;
