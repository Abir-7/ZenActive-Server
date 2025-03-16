import { FilterQuery, Query } from "mongoose";
import AppError from "../../errors/AppError";
import unlinkFile from "../../utils/unlinkFiles";
import { User } from "../user/user.model";
import { IMeal } from "./meal.interface";
import Meal from "./meal.model";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { sendPushNotification } from "../notification/notification.service";
const createMeal = async (mealData: IMeal) => {
  const newMeal = await Meal.create(mealData);

  if (!newMeal) {
    unlinkFile(mealData?.image);
  }

  sendPushNotification({
    title: "New Meal",
    body: `New meal added category: ${mealData.category}`,
  });
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

const getAllMeals = async (query: Record<string, unknown>) => {
  query.isDeleted = false;

  if (query.suitableFor == "No Preference") {
    delete query.suitableFor;
  }

  const meals = new QueryBuilder(Meal.find(), query)
    .search(["mealName"])
    .filter()
    .paginate()
    .sort();

  const allMeals = await meals.modelQuery;
  const meta = await meals.countTotal();
  return { allMeals, meta };
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
