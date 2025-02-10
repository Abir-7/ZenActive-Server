import { FilterQuery } from "mongoose";
import AppError from "../../errors/AppError";
import unlinkFile from "../../utils/unlinkFiles";
import { User } from "../user/user.model";
import { IMeal } from "./meal.interface";
import Meal from "./meal.model";
import httpStatus from "http-status";
const createMeal = async (mealData: IMeal) => {
  const newMeal = await Meal.create(mealData);

  if (!newMeal) {
    unlinkFile(mealData?.image);
  }

  return newMeal;
};

export const updateMeal = async (
  mealId: string,
  updateFields: Partial<IMeal>
) => {
  const isMealExist = await Meal.findOne({ _id: mealId });

  if (!isMealExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found.");
  }

  const updateObject: Record<string, any> = {};
  for (const [key, value] of Object.entries(updateFields)) {
    if (key.startsWith("nutritionalInfo.")) {
      updateObject[key] = value;
    } else {
      updateObject[key] = value;
    }
  }

  if (updateFields.image) {
    unlinkFile(isMealExist?.image);
  }

  const updatedMeal = await Meal.findByIdAndUpdate(
    mealId,
    { $set: updateObject },
    { new: true }
  );

  if (!updatedMeal) {
    throw new Error("Meal not found");
  }
  return updatedMeal;
};

const getAllMeals = async (filters: {
  suitableFor?: string;
  category?: string;
  mealTime?: string;
  nutritionalInfo?: Record<string, any>;
}) => {
  const query: FilterQuery<IMeal> = { isDeleted: false };

  if (filters.suitableFor) query.suitableFor = { $in: [filters.suitableFor] };
  if (filters.category) query.category = filters.category;
  if (filters.mealTime) query.mealTime = filters.mealTime;

  if (filters.nutritionalInfo) {
    for (const key in filters.nutritionalInfo) {
      query[`nutritionalInfo.${key}`] = filters.nutritionalInfo[key];
    }
  }

  return Meal.find(query);
};

const getSingleMeal = async (mealId: string) => {
  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  if (meal.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal deleted");
  }

  return meal;
};

const deleteMeal = async (mealId: string) => {
  const deletedMeal = await Meal.findByIdAndUpdate(mealId, {
    $set: { isDeleted: true },
  });

  if (!deletedMeal) {
    throw new AppError(404, "Meal not found");
  }

  return { message: "Meal deleted." };
};

const getAlluserMeals = async (
  filter: {
    category?: string;
    mealTime?: string;
  },
  userId: string
) => {
  const userData = await User.findOne({ _id: userId });
  console.log(userData);
  if (!userData) {
    throw new AppError(404, "User not found");
  }
  const meals = await Meal.find({
    ...filter,
    isDeleted: { $ne: true },
    suitableFor: { $in: [userData?.diet] },
  });
  return meals;
};

export const MealService = {
  updateMeal,
  createMeal,
  getAllMeals,
  getSingleMeal,
  deleteMeal,
  getAlluserMeals,
};
