import { Schema, model, Types } from "mongoose";

export interface IUserMealPlan {
  mealId: Types.ObjectId;
  userId: Types.ObjectId;
  isCompleted: boolean;
}

const UserMealPlanSchema = new Schema<IUserMealPlan>(
  {
    mealId: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserMealPlan = model<IUserMealPlan>("UserMealPlan", UserMealPlanSchema);

export default UserMealPlan;
