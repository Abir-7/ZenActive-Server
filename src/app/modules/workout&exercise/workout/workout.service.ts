import { Types } from "mongoose";
import IWorkout from "./workout.interface";
import Workout from "./workout.model";
import unlinkFile from "../../../utils/unlinkFiles";
import DailyExercise from "../../usersDailyExercise/dailyExercise.model";
import AppError from "../../../errors/AppError";
import status from "http-status";
import Exercise from "../exercise/exercise.model";
import QueryBuilder from "../../../builder/QueryBuilder";

// Create a new workout
const createWorkout = async (workoutData: IWorkout) => {
  const workout = new Workout(workoutData);
  if (!workout && workoutData.image) {
    unlinkFile(workoutData.image);
  }
  return await workout.save();
};

// Get all workouts
const getAllWorkouts = async (query: Record<string, unknown> = {}) => {
  query.isDeleted = false;
  const workout = new QueryBuilder(Workout.find().populate("exercises"), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate();
  const result = await workout.modelQuery;
  const meta = await workout.countTotal();
  return { result, meta };
};

//Get a workout by ID
const getWorkoutById = async (workoutId: Types.ObjectId) => {
  return await Workout.findById(workoutId).populate("exercises").exec();
};

const getWorkoutsExerciseById = async (
  workoutId: Types.ObjectId,
  userId: string
) => {
  const userObjectId = new Types.ObjectId(userId);

  const workouts = await Workout.aggregate([
    { $match: { _id: workoutId } },

    {
      $lookup: {
        from: "exercises",
        localField: "exercises",
        foreignField: "_id",
        as: "exercises",
      },
    },

    {
      $lookup: {
        from: "dailyexercises",
        let: { exerciseIds: "$exercises._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", userObjectId] },
                  { $in: ["$exerciseId", "$$exerciseIds"] },
                ],
              },
            },
          },
        ],
        as: "dailyExercises",
      },
    },

    {
      $addFields: {
        completedExerciseIds: {
          $map: {
            input: "$dailyExercises",
            as: "de",
            in: "$$de.exerciseId",
          },
        },
      },
    },

    {
      $addFields: {
        exercises: {
          $map: {
            input: "$exercises",
            as: "exercise",
            in: {
              $mergeObjects: [
                "$$exercise",
                {
                  isCompleted: {
                    $in: ["$$exercise._id", "$completedExerciseIds"],
                  },
                },
              ],
            },
          },
        },
      },
    },

    {
      $project: { dailyExercises: 0, completedExerciseIds: 0 },
    },
  ]);

  if (!workouts || workouts.length === 0) {
    throw new AppError(status.NOT_FOUND, "Workout not found.");
  }

  return workouts[0].exercises;
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
  const isExist = await Exercise.findOne({ _id: exerciseId });
  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Exercise not found.");
  }
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
  getWorkoutsExerciseById,
};
