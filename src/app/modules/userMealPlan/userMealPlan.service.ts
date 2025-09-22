import UserMealPlan from "./userMealPlan.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import Meal from "../meal/meal.model";

import { UserAppData } from "../userAppData/appdata.model";
import { User } from "../user/user.model";
const createUserMealPlan = async (userId: string, mealId: string) => {
  const userData = await User.findById(userId);

  if (userData && userData.hasPremiumAccess === false) {
    throw new AppError(httpStatus.NOT_FOUND, "You have to buy subcription.");
  }

  const isExist = await Meal.findById(mealId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  return await UserMealPlan.create({ mealId, userId });
};

const getUserMealPlans = async (userId: string, status: "true") => {
  console.log(status);

  const data = await UserMealPlan.find({ userId }).populate("mealId").lean();

  if (status == "true") {
    const mainData = data
      .map((meal) => {
        if (!meal.mealId) return null;
        const mealData = meal.mealId;

        return {
          ...mealData,
          isComplete: meal.isCompleted,
        };
      })
      .filter((meal) => meal && meal.isComplete === true);
    return mainData;
  } else {
    const mainData = data.map((meal) => {
      if (!meal.mealId) return null;
      const mealData = meal.mealId;

      return {
        ...mealData,
        isComplete: meal.isCompleted,
      };
    });

    return mainData;
  }
};

const getUserMealPlansByMealTime = async (userId: string, mealTime: string) => {
  const data = await UserMealPlan.find({ userId }).populate("mealId").lean();

  if (mealTime) {
    const mainData = data
      .map((meal) => {
        if (!meal.mealId) return null;
        const mealData = meal.mealId as any;

        return {
          ...mealData,
          isComplete: meal.isCompleted,
        };
      })
      .filter((meal) => meal && meal.mealTime === mealTime);
    return mainData;
  } else {
    const mainData = data.map((meal) => {
      if (!meal.mealId) return null;
      const mealData = meal.mealId as any;

      return {
        ...mealData,
        isComplete: meal.isCompleted,
      };
    });

    return mainData;
  }
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
  getUserMealPlansByMealTime,
};
