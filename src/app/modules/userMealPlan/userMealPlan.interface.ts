import { Types } from "mongoose";

export interface IUserMealPlan {
  mealId: Types.ObjectId;
  isComplited: false;
  userId: Types.ObjectId;
}
