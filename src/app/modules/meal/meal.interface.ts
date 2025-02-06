import { DietType } from "../user/user.interface";

export interface INutritionalInfo {
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export interface IMeal {
  mealName: string;
  image: string;
  category: string;
  nutritionalInfo: INutritionalInfo;
  isDeleted: boolean;
  suitableFor: DietType[];
  mealTime: TTime;
}

export const Time = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
type TTime = (typeof Time)[number];
