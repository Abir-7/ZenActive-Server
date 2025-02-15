import { Schema, model } from "mongoose";

import { IUserAppData } from "./appdata.interface";

const userAppDataSchema = new Schema<IUserAppData>(
  {
    tdee: { type: Number, required: false, default: 0 },
    workoutTime: { type: Number, required: false, default: 0 },
    points: { type: Number, required: false, default: 0 },
    gainedCalories: { type: Number, required: false, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserAppData = model<IUserAppData>(
  "UserAppData",
  userAppDataSchema
);
