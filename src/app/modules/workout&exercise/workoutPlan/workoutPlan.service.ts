import AppError from "../../../errors/AppError";

import { IWorkoutPlan } from "./workoutPlan.interface";
import httpStatus from "http-status";
import { WorkoutPlan } from "./workoutPlan.model";
import unlinkFile from "../../../utils/unlinkFiles";
import UserWorkoutPlan from "../../userWorkoutPlan/userWorkoutPlan.model";

import { getAIResponse } from "../../../utils/getAIResponse";
import Workout from "../workout/workout.model";
import { getJson } from "../../../utils/getJson";

const createWorkoutPlan = async (workoutData: IWorkoutPlan) => {
  const durationInDays = workoutData.duration * 7;
  workoutData.duration = durationInDays;

  let finalWorkouts: any[] = [];

  // Check if manual workouts are provided
  if (workoutData.workouts && workoutData.workouts.length > 0) {
    finalWorkouts = workoutData.workouts;
    // Optional: Validate that the number of workouts matches the duration
    if (finalWorkouts.length !== durationInDays) {
       throw new AppError(httpStatus.BAD_REQUEST, `Selected ${finalWorkouts.length} workouts, but a ${workoutData.duration / 7}-week plan requires ${durationInDays} workout sessions. Please adjust your selection or the plan duration.`);
    }
  } else {
    // AI-Assisted Generation
    const allWorkouts = await Workout.find({ isDeleted: false }).select("_id name");

    if (!allWorkouts || allWorkouts.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No workouts available to create a plan.");
    }

    const availableWorkouts = allWorkouts.map((w) => ({
      id: w._id,
      name: w.name,
    }));

    const prompt = `
      Create a structured workout plan JSON.
      Available Workouts: ${JSON.stringify(availableWorkouts)}

      Plan details:
      - Name: "${workoutData.name}"
      - Total Duration: ${durationInDays} days
      - Constraint: Return exactly ${durationInDays} workout IDs in an array.
      - Diversity: Use a variety of workouts from the list.

      Return format:
      {
        "workouts": ["id1", "id2", ..., "id${durationInDays}"]
      }
    `;

    // Use Native JSON Response mode
    const json = await getAIResponse(prompt, "You are a professional fitness assistant.", true);

    if (!json || !Array.isArray(json.workouts)) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "AI failed to generate a valid workout plan.");
    }

    // Healing Logic: Ensure exact duration match
    finalWorkouts = [...json.workouts];
    
    if (finalWorkouts.length > durationInDays) {
      finalWorkouts = finalWorkouts.slice(0, durationInDays);
    } else if (finalWorkouts.length < durationInDays) {
      // Pad with the last workout or a random one if too short
      const paddingCount = durationInDays - finalWorkouts.length;
      for (let i = 0; i < paddingCount; i++) {
        finalWorkouts.push(finalWorkouts[finalWorkouts.length - 1] || availableWorkouts[0].id);
      }
    }
  }

  const data = { ...workoutData, workouts: finalWorkouts };
  const workout = await WorkoutPlan.create(data);

  if (!workout && data.image) {
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
    if (workoutData.image) unlinkFile(workoutData.image);
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

  const { isDeleted, duration, page = 1, limit = 15, name } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Step 1: Build query filter
  const filter: Record<string, unknown> = { isDeleted };
  if (duration) {
    filter.duration = Number((duration as number) * 7);
  }
  if (name !== "" && typeof name === "string") {
    filter.name = { $regex: name, $options: "i" };
  }
  console.log(filter);
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
