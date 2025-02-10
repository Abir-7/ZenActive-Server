import { Types } from "mongoose";
import IWorkout from "./workout.interface";
import Workout from "./workout.model";
import unlinkFile from "../../../utils/unlinkFiles";

// Create a new workout
const createWorkout = async (workoutData: IWorkout) => {
  const workout = new Workout(workoutData);
  if (!workout && workoutData.image) {
    unlinkFile(workoutData.image);
  }
  return await workout.save();
};

// Get all workouts
const getAllWorkouts = async () => {
  return await Workout.find().populate("exercises").exec();
};

// Get a workout by ID
const getWorkoutById = async (workoutId: Types.ObjectId) => {
  return await Workout.findById(workoutId).populate("exercises").exec();
};

// Update a workout by ID
const updateWorkout = async (
  workoutId: Types.ObjectId,
  updateData: Partial<IWorkout>
) => {
  const workoutData = await Workout.findById(workoutId);

  if (workoutData && updateData.image) {
    unlinkFile(workoutData.image);
  }

  return await Workout.findByIdAndUpdate(workoutId, updateData, { new: true })

    .populate("exercises")
    .exec();
};

// Delete a workout by ID
const deleteWorkout = async (workoutId: Types.ObjectId) => {
  await Workout.findByIdAndUpdate(
    workoutId,
    { isDeleted: true },
    { new: true }
  ).exec();
};

// Add an exercise to a workout
const addExerciseToWorkout = async (
  workoutId: Types.ObjectId,
  exerciseId: Types.ObjectId
) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    { $push: { exercises: exerciseId } },
    { new: true }
  )
    .populate("exercises")
    .exec();
};

// Remove an exercise from a workout
const removeExerciseFromWorkout = async (
  workoutId: Types.ObjectId,
  exerciseId: Types.ObjectId
) => {
  return await Workout.findByIdAndUpdate(
    workoutId,
    { $pull: { exercises: exerciseId } },
    { new: true }
  )
    .populate("exercises")
    .exec();
};

export const WorkoutService = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
};
