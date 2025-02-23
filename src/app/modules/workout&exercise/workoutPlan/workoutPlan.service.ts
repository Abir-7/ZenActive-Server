import AppError from "../../../errors/AppError";

import { IWorkoutPlan } from "./workoutPlan.interface";
import httpStatus from "http-status";
import { WorkoutPlan } from "./workoutPlan.model";
import unlinkFile from "../../../utils/unlinkFiles";
import UserWorkoutPlan from "../../userWorkoutPlan/userWorkoutPlan.model";
import Exercise from "../exercise/exercise.model";
import { getGeminiResponse } from "../../../utils/getGeminiResponse";
import Workout from "../workout/workout.model";
import { getJson } from "../../../utils/getJson";

const createWorkoutPlan = async (workoutData: IWorkoutPlan) => {
  const allWorkout = JSON.stringify(await Workout.find({ isDeleted: false }));

  const workouts = await getGeminiResponse(
    `${allWorkout} this is all workouts. i want to make array with these workout id based on workout plan name. name is ${workoutData.name}. 
    example-- workouts:[id1,id2.....] 
    you can repete id if need. ** make sure array lenth must have to equal ${workoutData.duration} , give valid json**
    `
  );

  const json = await getJson(workouts);

  const data = { ...json, ...workoutData };
  console.log(data);
  if (data.duration !== data?.workouts?.length) {
    throw new AppError(
      500,
      `day:${workoutData?.duration} not equal workouts:${workoutData?.workouts?.length} in numbner`
    );
  }

  const workout = await WorkoutPlan.create(data);

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

const getAllWorkouts = async (
  userId: string,
  query: Record<string, unknown>
) => {
  query.isDeleted = false;

  const workoutPlans = await WorkoutPlan.find(query).populate({
    path: "workouts",
    populate: "exercises",
  });

  const workoutPlansWithStatus = await Promise.all(
    workoutPlans.map(async (workoutPlan) => {
      const userWorkoutPlan = await UserWorkoutPlan.findOne({
        userId,
        workoutPlanId: workoutPlan._id,
        isCompleted: "InProgress",
      });

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

const getSingleWorkoutDefault = async (workoutPlanId: string) => {
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
  createWorkoutPlan,
  getAllWorkouts,
  getSingleWorkout,
  deleteWorkout,
  getSingleWorkoutDefault,
};
