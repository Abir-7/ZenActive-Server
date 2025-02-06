import AppError from "../../errors/AppError";
import unlinkFile from "../../utils/unlinkFiles";
import { IMeal } from "./meal.interface";
import Meal from "./meal.model";
import httpStatus from "http-status";
const createMeal = async (mealData: IMeal) => {
  const newMeal = await Meal.create(mealData);
  return newMeal;
};

export const updateMeal = async (
  mealId: string,
  updateFields: Record<string, any>
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
  unlinkFile(isMealExist?.image);

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

const getAllMeals = async (filter = {}) => {
  const meals = await Meal.find({ ...filter, isDeleted: { $ne: true } });
  return meals;
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
  const deletedMeal = await Meal.findByIdAndUpdate(
    mealId,
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedMeal) {
    throw new Error("Meal not found");
  }

  return { message: "Meal deleted." };
};

export const MealService = {
  updateMeal,
  createMeal,
  getAllMeals,
  getSingleMeal,
  deleteMeal,
};
