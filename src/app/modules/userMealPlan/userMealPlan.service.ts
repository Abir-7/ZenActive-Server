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
  options?: { status?: "true"; mealTime?: string }
) => {
  // console.log(status);

  // const data = await UserMealPlan.find({ userId }).populate("mealId").lean();

  // if (status == "true") {
  //   const mainData = data
  //     .map((meal) => {
  //       if (!meal.mealId) return null;
  //       const mealData = meal.mealId;

  //       return {
  //         ...mealData,
  //         isComplete: meal.isCompleted,
  //       };
  //     })
  //     .filter((meal) => meal && meal.isComplete === true);
  //   return mainData;
  // } else {
  //   const mainData = data.map((meal) => {
  //     if (!meal.mealId) return null;
  //     const mealData = meal.mealId;

  //     return {
  //       ...mealData,
  //       isComplete: meal.isCompleted,
  //     };
  //   });

  //   return mainData;
  // }

  const { status, mealTime } = options || {};

  const data = await UserMealPlan.find({ userId }).populate("mealId").lean();

  const mainData = data
    .map((meal) => {
      if (!meal.mealId) return null;
      const mealData = meal.mealId as any;

      return {
        ...mealData,
        isComplete: meal.isCompleted,
      };
    })
    .filter((meal) => {
      if (!meal) return false;

      // Filter by status if provided
      if (status === "true" && meal.isComplete !== true) return false;

      // Filter by mealTime if provided
      if (mealTime && meal.mealTime !== mealTime) return false;

      return true;
    });

  return mainData;
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
