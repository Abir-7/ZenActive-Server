"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserMealPlanSchema = new mongoose_1.Schema({
    mealId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Meal", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true });
const UserMealPlan = (0, mongoose_1.model)("UserMealPlan", UserMealPlanSchema);
exports.default = UserMealPlan;
