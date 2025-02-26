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

const getAllExercise = async (
  userRole: string,
  userId: string,
  page: number = 1,
  limit: number = 12
) => {
  const skip = (page - 1) * limit;

  if (userRole === "ADMIN") {
    // Get total count for pagination
    const total = await Exercise.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      meta: { limit, page, total, totalPage },
      data: exercises,
    };
  } else {
    // Calculate today's boundaries.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get total count for pagination
    const total = await Exercise.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "dailyexercises",
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
            { $project: { _id: 1 } },
          ],
          as: "dailyExercise",
        },
      },
      {
        $addFields: { isCompleted: { $gt: [{ $size: "$dailyExercise" }, 0] } },
      },
      { $project: { dailyExercise: 0 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      meta: { limit, page, total, totalPage },
      data: exercises,
    };
  }
};
// Get an exercise by ID
const getExerciseById = async (exerciseId: string) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Start of today
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // End of today

  const [participantCount, exercise] = await Promise.all([
    DailyExercise.countDocuments({
      exerciseId,
      completedDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }),
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
