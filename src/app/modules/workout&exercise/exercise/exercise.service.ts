import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";
import DailyExercise from "../../usersDailyExercise/dailyExercise.model";
import { IExercise } from "./exercise.interface";
import Exercise from "./exercise.model";

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

// Get all exercises
const getAllExercise = async () => {
  return await Exercise.find().exec();
};

// Get an exercise by ID
const getExerciseById = async (exerciseId: string) => {
  const [participantCount, exercise] = await Promise.all([
    DailyExercise.countDocuments({ exerciseId }),
    Exercise.findById(exerciseId).exec(),
  ]);

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
