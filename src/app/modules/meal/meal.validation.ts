import { z } from "zod";
import { DietType } from "../user/user.interface";
import { Time } from "./meal.interface";

export const zodMealSchema = z.object({
  body: z.object({
    mealName: z.string(),
    category: z.string(),
    suitableFor: z.array(z.nativeEnum(DietType)),
    nutritionalInfo: z
      .object({
        calories: z.number(),
        carbs: z.number(),
        proteins: z.number(),
        fats: z.number(),
      })
      .optional(),

    mealTime: z.enum(Time).optional(),
    amount: z.number().optional(),
  }),
});

export const zodUpdateMealSchema = z.object({
  body: z.object({
    mealName: z.string().optional(),
    category: z.string().optional(),
    suitableFor: z.array(z.nativeEnum(DietType)).optional(),
    nutritionalInfo: z
      .object({
        calories: z.number().optional(),
        carbs: z.number().optional(),
        proteins: z.number().optional(),
        fats: z.number().optional(),
      })
      .optional(),
    mealTime: z.enum(Time).optional(),
    amount: z.number().optional(),
  }),
});
