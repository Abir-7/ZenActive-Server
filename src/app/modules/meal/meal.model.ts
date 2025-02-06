import { model, Mongoose, Schema } from "mongoose";
import { IMeal, INutritionalInfo } from "./meal.interface";

const NutritionalInfoSchema: Schema = new Schema<INutritionalInfo>(
  {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    proteins: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
  { _id: false }
);

const MealSchema: Schema = new Schema<IMeal>({
  mealName: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  nutritionalInfo: { type: NutritionalInfoSchema, required: true },
  isDeleted: { type: Boolean, default: false },
});

const Meal = model<IMeal>("Meal", MealSchema);

export default Meal;
