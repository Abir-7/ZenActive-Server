import AppError from "../../../errors/AppError";

import { IWorkoutPlan } from "./workoutPlan.interface";
import httpStatus from "http-status";
import { WorkoutPlan } from "./workoutPlan.model";
import unlinkFile from "../../../utils/unlinkFiles";
import UserWorkoutPlan from "../../userWorkoutPlan/userWorkoutPlan.model";

const createWorkout = async (workoutData: IWorkoutPlan) => {
  if (workoutData.duration * 7 !== workoutData.workouts.length) {
    throw new AppError(
      500,
      `day:${workoutData.duration * 7} not equal workouts:${
        workoutData.workouts.length
      } in numbner`
    );
  }

  const workout = await WorkoutPlan.create(workoutData);

  if (!workout) {
    unlinkFile(workoutData.image);
  }

  return workout;
};

export const updateWorkout = async (
  workoutId: string,
  workoutData: Partial<IWorkoutPlan>
) => {
  const isWorkoutExist = await WorkoutPlan.findOne({ _id: workoutId });

  if (!isWorkoutExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Failed to update. Workout not found."
    );
  }
  if (isWorkoutExist.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update. Workout is deleted."
    );
  }

  const updatedWorkout = await WorkoutPlan.findOneAndUpdate(
    { _id: workoutId },
    { ...workoutData },
    {
      new: true,
    }
  );

  if (!updatedWorkout) {
    unlinkFile(isWorkoutExist.image);
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update. ");
  } else {
    if (workoutData.image) {
      unlinkFile(isWorkoutExist.image);
    }
  }
  return updatedWorkout;
};

const getAllWorkouts = async (userId: string) => {
  // const workouts = await WorkoutPlan.find({ isDeleted: false }).populate({
  //   path: "workouts",
  //   populate: "exercises",
  // });
  // return workouts;

  const workoutPlans = await WorkoutPlan.find({ isDeleted: false }).populate({
    path: "workouts",
    populate: "exercises",
  });

  // For each workout plan, check if the user is enrolled and add the field
  const workoutPlansWithStatus = await Promise.all(
    workoutPlans.map(async (workoutPlan) => {
      // Check if the user has an entry in UserWorkoutPlan with the current workout plan
      const userWorkoutPlan = await UserWorkoutPlan.findOne({
        userId,
        workoutPlanId: workoutPlan._id,
        isCompleted: "InProgress",
      });

      // If found, add isEnrolled as true, otherwise false
      return {
        ...workoutPlan.toObject(),
        isEnrolled: userWorkoutPlan ? true : false,
      };
    })
  );

  return workoutPlansWithStatus;
};
const getSingleWorkout = async (workoutPlanId: string, userId: string) => {
  const userWorkoutPlan = await UserWorkoutPlan.findOne({
    userId,
    workoutPlanId: workoutPlanId,
    isCompleted: "InProgress",
  })
    .populate({
      path: "workoutPlanId",
      select: "title _id duration workouts",
      populate: {
        path: "workouts",
        select: "_id name description exercises",
        populate: {
          path: "exercises",
        },
      },
    })
    .lean();
  if (userWorkoutPlan?._id) {
    return userWorkoutPlan;
  }
  const workout = await WorkoutPlan.findById(workoutPlanId).populate({
    path: "workouts",
    populate: "exercises",
  });
  if (!workout) {
    throw new AppError(httpStatus.NOT_FOUND, "Workout not found.");
  }
  if (workout.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Workout is deleted.");
  }

  return workout;
};

export const deleteWorkout = async (workoutId: string) => {
  const workout = await WorkoutPlan.findById(workoutId);

  if (!workout) {
    throw new AppError(httpStatus.NOT_FOUND, "Workout not found.");
  }

  await WorkoutPlan.findByIdAndDelete(
    { _id: workoutId },
    {
      isDeleted: true,
    }
  );
  return { message: "Workout deleted successfully" };
};

export const WorkoutPlanService = {
  updateWorkout,
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteWorkout,
};
