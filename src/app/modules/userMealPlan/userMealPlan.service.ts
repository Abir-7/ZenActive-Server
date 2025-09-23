import UserMealPlan from "./userMealPlan.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import Meal from "../meal/meal.model";

import { UserAppData } from "../userAppData/appdata.model";
import { User } from "../user/user.model";
const createUserMealPlan = async (userId: string, mealIds: string[]) => {
  // Check user
  const userData = await User.findById(userId);
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (userData.hasPremiumAccess === false) {
    throw new AppError(httpStatus.FORBIDDEN, "You have to buy subscription.");
  }

  // Check meals exist
  const meals = await Meal.find({ _id: { $in: mealIds } });
  if (meals.length !== mealIds.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Some meals not found");
  }

  // Create multiple UserMealPlan entries
  const mealPlans = mealIds.map((mealId) => ({ mealId, userId }));
  return await UserMealPlan.insertMany(mealPlans);
};

const getUserMealPlans = async (
  userId: string,
  mealStatus?: "" | "completed"
) => {
  // Build the query
  const query: any = { userId };
  if (mealStatus === "completed") {
    query.isCompleted = true; // Only fetch completed meals
  }

  const data = await UserMealPlan.find(query).populate("mealId").lean();

  const mainData = data
    .map((meal) => {
      if (!meal.mealId) return null;
      const mealData = meal.mealId;

      return {
        ...mealData,
        isComplete: meal.isCompleted,
      };
    })
    .filter(Boolean);

  return mainData;
};

// export const getUserMealPlanById = async (userid: string) => {
//   return await UserMealPlan.findById(id).populate("mealId userId");
// };

const updateUserMealPlan = async (userId: string, id: string) => {
  const updatedUserMealPlan = await UserMealPlan.findOneAndUpdate(
    { mealId: id, userId },
    { isCompleted: true },
    { new: true }
  ).populate("mealId");

  if (!updatedUserMealPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "UserMealPlan not found");
  }

  const userAppData = await UserAppData.findOne({ userId });
  if (!userAppData) {
    throw new AppError(httpStatus.NOT_FOUND, "User App data not found");
  }

  await UserAppData.findOneAndUpdate(
    { userId },
    {
      $set: {
        gainedCalories:
          (updatedUserMealPlan as any).mealId?.nutritionalInfo?.calories +
          userAppData.gainedCalories,
      },
    },
    { new: true, upsert: true }
  );
  return updatedUserMealPlan;
};

const deleteUserMealPlan = async (id: string, userId: string) => {
  const result = await UserMealPlan.findOneAndDelete({ _id: id, userId });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Delete Failed");
  }

  return { message: "Meal plan deleted." };
};

export const UserMealPlanService = {
  createUserMealPlan,
  getUserMealPlans,
  updateUserMealPlan,
  deleteUserMealPlan,
};
