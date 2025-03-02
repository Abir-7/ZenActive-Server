"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateMealSchema = exports.zodMealSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("../user/user.interface");
const meal_interface_1 = require("./meal.interface");
exports.zodMealSchema = zod_1.z.object({
    body: zod_1.z.object({
        mealName: zod_1.z.string(),
        category: zod_1.z.string(),
        suitableFor: zod_1.z.array(zod_1.z.nativeEnum(user_interface_1.DietType)),
        nutritionalInfo: zod_1.z
            .object({
            calories: zod_1.z.number(),
            carbs: zod_1.z.number(),
            proteins: zod_1.z.number(),
            fats: zod_1.z.number(),
        })
            .optional(),
        mealTime: zod_1.z.enum(meal_interface_1.Time).optional(),
        amount: zod_1.z.number().optional(),
    }),
});
exports.zodUpdateMealSchema = zod_1.z.object({
    body: zod_1.z.object({
        mealName: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        suitableFor: zod_1.z.array(zod_1.z.nativeEnum(user_interface_1.DietType)).optional(),
        nutritionalInfo: zod_1.z
            .object({
            calories: zod_1.z.number().optional(),
            carbs: zod_1.z.number().optional(),
            proteins: zod_1.z.number().optional(),
            fats: zod_1.z.number().optional(),
        })
            .optional(),
        mealTime: zod_1.z.enum(meal_interface_1.Time).optional(),
        amount: zod_1.z.number().optional(),
    }),
});
