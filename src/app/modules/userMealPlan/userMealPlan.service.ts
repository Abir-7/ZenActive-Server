import UserMealPlan from "./userMealPlan.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import Meal from "../meal/meal.model";
import { IMeal } from "../meal/meal.interface";
import { UserAppData } from "../userAppData/appdata.model";
const createUserMealPlan = async (userId: string, mealId: string) => {
  const isExist = await Meal.findById(mealId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  return await UserMealPlan.create({ mealId, userId });
};

const getUserMealPlans = async (userId: string) => {
  return await UserMealPlan.find({ userId }).populate("mealId");
};

// export const getUserMealPlanById = async (userid: string) => {
//   return await UserMealPlan.findById(id).populate("mealId userId");
// };

const updateUserMealPlan = async (userId: string, id: string) => {
  const updatedUserMealPlan = await UserMealPlan.findOneAndUpdate(
    { _id: id, userId },
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
      gainedCalories:
        (updatedUserMealPlan as any).mealId?.nutritionalInfo?.calories +
        userAppData?.gainedCalories,
    }
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
