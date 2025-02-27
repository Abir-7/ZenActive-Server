import AppError from "../../../errors/AppError";

import { IWorkoutPlan } from "./workoutPlan.interface";
import httpStatus from "http-status";
import { WorkoutPlan } from "./workoutPlan.model";
import unlinkFile from "../../../utils/unlinkFiles";
import UserWorkoutPlan from "../../userWorkoutPlan/userWorkoutPlan.model";

import { getGeminiResponse } from "../../../utils/getGeminiResponse";
import Workout from "../workout/workout.model";
import { getJson } from "../../../utils/getJson";

const createWorkoutPlan = async (workoutData: IWorkoutPlan) => {
  workoutData.duration = workoutData.duration * 7;

  const allWorkouts = await Workout.find({ isDeleted: false });

  // Extract only necessary fields to reduce token usage
  const availableWorkouts = allWorkouts.map((w) => ({
    id: w._id,
    name: w.name,
  }));

  const prompt = `
    You are an AI that creates structured workout plans. Below is a list of available workouts:
    ${JSON.stringify(availableWorkouts)}

**workouts array must have exactly ${String(
    Number(workoutData.duration) + 15
  )} workoutId**

    Create a workout plan with:
    - Plan Name: "${workoutData.name}"
    - Duration: ${workoutData.duration} days
    - Workouts must be selected only from the provided list.
    - **workouts array must have exactly ${String(
      Number(workoutData.duration) + 15
    )} workoutId**.
    - Workouts can be repeated, but diversity is preferred.
    - Return **only** a valid JSON object, without any extra text.

    Example Response:
    {
      "workouts": ["id1", "id2", "id3", "id4", ..., "idN"]
    }
  `;

  const workoutsResponse = await getGeminiResponse(prompt);

  const json = await getJson(workoutsResponse);

  if (json?.workouts?.length > workoutData.duration) {
    console.log(json?.workouts.slice(0, workoutData.duration));

    json.workouts = json?.workouts.slice(0, workoutData.duration);
  }
  if (
    !json ||
    !Array.isArray(json.workouts) ||
    json.workouts.length !== workoutData.duration
  ) {
    throw new AppError(
      500,
      `Invalid workout plan: Expected ${workoutData.duration} workouts, got ${
        json?.workouts?.length || 0
      }`
    );
  }

  const data = { ...json, ...workoutData };

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

  // Step 1: Build query filter
  const filter: Record<string, unknown> = { isDeleted };
  if (duration) {
    filter.duration = duration;
  }

  // Step 2: Get total count for pagination
  const total = await WorkoutPlan.countDocuments(filter);
  const totalPage = Math.ceil(total / Number(limit));

  // Step 3: Fetch paginated workout plans with populated exercises
  const workoutPlans = await WorkoutPlan.find(filter)
    .populate({
      path: "workouts",
      populate: "exercises",
    })
    .skip(skip)
    .limit(Number(limit));

  // Step 4: Check if user is enrolled in each workout plan
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
