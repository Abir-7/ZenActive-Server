import { Types } from "mongoose";

export interface IUserAppData {
  tdee?: number;
  points?: number;
  gainedCalories?: number;
  userId: Types.ObjectId;
}
