import AppError from "../../../errors/AppError";

import { IWorkoutPlan } from "./workoutPlan.interface";
import httpStatus from "http-status";
import { WorkoutPlan } from "./workoutPlan.model";

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
  return updatedWorkout;
};

const getAllWorkouts = async () => {
  const workouts = await WorkoutPlan.find({ isDeleted: false }).populate({
    path: "workouts",
    populate: "exercises",
  });
  return workouts;
};
const getSingleWorkout = async (workoutId: string) => {
  const workout = await WorkoutPlan.findById(workoutId).populate({
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
