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
  if (json.workouts) {
    console.log(json.workouts);
  }
  const data = { ...json, ...workoutData };
  console.log(data.workouts.length);
  if (data.duration !== data.workouts.length) {
    throw new AppError(
      500,
      `day:${workoutData?.duration} not equal workouts:${data.workouts.length} in numbner`
    );
  }

  const workout = await WorkoutPlan.create(data);

  if (!workout) {
    unlinkFile(data.image);
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

  const { isDeleted, duration, page = 1, limit = 15 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  // Step 1: Get total count for pagination
  const total = await WorkoutPlan.countDocuments({ duration, isDeleted });
  const totalPage = Math.ceil(total / Number(limit));

  // Step 2: Fetch paginated workout plans with populated exercises
  const workoutPlans = await WorkoutPlan.find({ duration, isDeleted })
    .populate({
      path: "workouts",
      populate: "exercises",
    })
    .skip(skip)
    .limit(Number(limit));

  // Step 3: Check if user is enrolled in each workout plan
  const workoutPlanIds = workoutPlans.map((workout) => workout._id);
  const userWorkoutPlans = await UserWorkoutPlan.find({
    userId,
    workoutPlanId: { $in: workoutPlanIds },
    isCompleted: "InProgress",
  });

  const workoutPlansWithStatus = workoutPlans.map((workoutPlan) => {
    const isEnrolled = userWorkoutPlans.some(
      (userPlan) =>
        userPlan.workoutPlanId.toString() === workoutPlan._id.toString()
    );

    return {
      ...workoutPlan.toObject(),
      isEnrolled,
    };
  });

  return {
    meta: { limit: Number(limit), page: Number(page), total, totalPage },
    data: workoutPlansWithStatus,
  };
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
