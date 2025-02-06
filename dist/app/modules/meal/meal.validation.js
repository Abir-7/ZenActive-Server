"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateMealSchema = exports.zodMealSchema = void 0;
const zod_1 = require("zod");
// Reusable schema for required nutritional information
const NutritionalInfoSchema = zod_1.z.object({
    calories: zod_1.z
        .number({ required_error: "Calories is required" })
        .min(0, { message: "Calories must be a positive number" }),
    carbs: zod_1.z
        .number({ required_error: "Carbs is required" })
        .min(0, { message: "Carbs must be a positive number" }),
    proteins: zod_1.z
        .number({ required_error: "Proteins is required" })
        .min(0, { message: "Proteins must be a positive number" }),
    fats: zod_1.z
        .number({ required_error: "Fats is required" })
        .min(0, { message: "Fats must be a positive number" }),
});
const BaseMealSchema = zod_1.z.object({
    mealName: zod_1.z
        .string({ required_error: "Meal name is required" })
        .min(1, { message: "Meal name cannot be empty" }),
    category: zod_1.z
        .string({ required_error: "Category is required" })
        .min(1, { message: "Category cannot be empty" }),
});
exports.zodMealSchema = zod_1.z.object({
    body: BaseMealSchema.extend({
        nutritionalInfo: NutritionalInfoSchema,
    }),
});
// Schema for updating a meal
const OptionalNutritionalInfoSchema = NutritionalInfoSchema.partial();
exports.zodUpdateMealSchema = zod_1.z.object({
    body: BaseMealSchema.partial().extend({
        nutritionalInfo: OptionalNutritionalInfoSchema.optional(),
    }),
});
