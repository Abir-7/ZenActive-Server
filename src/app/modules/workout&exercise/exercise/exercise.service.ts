import mongoose, { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";
import { User } from "../../user/user.model";
import DailyExercise from "../../usersDailyExercise/dailyExercise.model";
import { IExercise } from "./exercise.interface";
import Exercise from "./exercise.model";
import status from "http-status";

// Create a new exercise
const createExercise = async (exerciseData: IExercise) => {
  const exercise = await Exercise.create({
    ...exerciseData,
    duration: Number(exerciseData.duration * 60),
  });
  if (!exercise && exerciseData.image) {
    unlinkFile(exerciseData.image);
  }
  return exercise;
};

const getAllExercise = async (userRole: string, userId: string) => {
  if (userRole === "ADMIN") {
    // For admin, return all active exercises.
    return await Exercise.find({ isDeleted: false }).exec();
  } else {
    // Calculate today's boundaries.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await Exercise.aggregate([
      // Only include active (not deleted) exercises.
      { $match: { isDeleted: false } },
      // Lookup daily exercise records for the current user and only for today.
      {
        $lookup: {
          from: "dailyexercises", // Use your actual DailyExercise collection name.
          let: { exerciseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$exerciseId", "$$exerciseId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                    { $gte: ["$completedDate", startOfToday] },
                    { $lte: ["$completedDate", endOfToday] },
                  ],
                },
              },
            },
            // Optionally, project only the fields you need.
            { $project: { _id: 1 } },
          ],
          as: "dailyExercise",
        },
      },
      // Add the isCompleted field: true if there's at least one matching daily exercise.
      {
        $addFields: {
          isCompleted: { $gt: [{ $size: "$dailyExercise" }, 0] },
        },
      },
      // Optionally, remove the dailyExercise field from the output.
      {
        $project: { dailyExercise: 0 },
      },
    ]);
  }
};

// Get an exercise by ID
const getExerciseById = async (exerciseId: string) => {
  const [participantCount, exercise] = await Promise.all([
    DailyExercise.countDocuments({ exerciseId }),
    Exercise.findById(exerciseId).exec(),
  ]);

  if (!exercise) {
    throw new AppError(status.NOT_FOUND, "Exercise not found.");
  }

  return { exercise, participant: participantCount };
};

// Update an exercise by ID
const updateExercise = async (
  exerciseId: string,
  updateData: Partial<IExercise>
) => {
  const isExist = await Exercise.findById(exerciseId);

  if (!isExist?._id) {
    throw new AppError(404, "Workout not found.");
  }

  if (updateData.image) {
    unlinkFile(isExist.image as string);
  }
  if (updateData.video) {
    unlinkFile(isExist.video as string);
  }
  const updated = await Exercise.findByIdAndUpdate(exerciseId, updateData, {
    new: true,
  }).exec();

  if (!updated?._id) {
    throw new AppError(404, "Failed to Update");
  }
  return updated;
};

const deleteExercise = async (exerciseId: string) => {
  const isExist = await Exercise.findByIdAndUpdate(
    exerciseId,
    { isDeleted: true },
    { new: true }
  );
  if (!isExist?._id) {
    throw new AppError(404, "Workout not found.");
  }

  return { message: "Exercise deleted" };
};

// Group all service functions into an object
export const ExerciseService = {
  createExercise,
  getAllExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
