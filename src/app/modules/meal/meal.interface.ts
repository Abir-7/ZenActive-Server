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
}
