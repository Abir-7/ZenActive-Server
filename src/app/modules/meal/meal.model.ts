import { model, Mongoose, Schema } from "mongoose";
import { IMeal, INutritionalInfo, Time } from "./meal.interface";
import { DietType } from "../user/user.interface";

const NutritionalInfoSchema: Schema = new Schema<INutritionalInfo>(
  {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    proteins: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
  { _id: false }
);

const MealSchema: Schema = new Schema<IMeal>(
  {
    mealName: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    suitableFor: Object.values(DietType),
    nutritionalInfo: { type: NutritionalInfoSchema, required: true },
    isDeleted: { type: Boolean, default: false },
    mealTime: {
      type: String,
      enum: Time, // Use the constant here
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Meal = model<IMeal>("Meal", MealSchema);

export default Meal;
