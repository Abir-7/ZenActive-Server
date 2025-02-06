import { z } from "zod";
import { Time } from "./meal.interface";

// Reusable schema for required nutritional information
const NutritionalInfoSchema = z.object({
  calories: z
    .number({ required_error: "Calories is required" })
    .min(0, { message: "Calories must be a positive number" }),
  carbs: z
    .number({ required_error: "Carbs is required" })
    .min(0, { message: "Carbs must be a positive number" }),
  proteins: z
    .number({ required_error: "Proteins is required" })
    .min(0, { message: "Proteins must be a positive number" }),
  fats: z
    .number({ required_error: "Fats is required" })
    .min(0, { message: "Fats must be a positive number" }),
});

const BaseMealSchema = z.object({
  mealName: z
    .string({ required_error: "Meal name is required" })
    .min(1, { message: "Meal name cannot be empty" }),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, { message: "Category cannot be empty" }),
  mealTime: z
    .enum(Time, { required_error: "Meal time is required" })
    .refine((val) => ["Breakfast", "Lunch", "Dinner", "Snacks"].includes(val), {
      message: "Invalid meal time",
    }),
});

export const zodMealSchema = z.object({
  body: BaseMealSchema.extend({
    nutritionalInfo: NutritionalInfoSchema,
  }),
});

// Schema for updating a meal
const OptionalNutritionalInfoSchema = NutritionalInfoSchema.partial();

export const zodUpdateMealSchema = z.object({
  body: BaseMealSchema.partial().extend({
    nutritionalInfo: OptionalNutritionalInfoSchema.optional(),
  }),
});
