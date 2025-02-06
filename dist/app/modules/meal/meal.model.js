"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NutritionalInfoSchema = new mongoose_1.Schema({
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    proteins: { type: Number, required: true },
    fats: { type: Number, required: true },
}, { _id: false });
const MealSchema = new mongoose_1.Schema({
    mealName: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    nutritionalInfo: { type: NutritionalInfoSchema, required: true },
    isDeleted: { type: Boolean, default: false },
});
const Meal = (0, mongoose_1.model)("Meal", MealSchema);
exports.default = Meal;
