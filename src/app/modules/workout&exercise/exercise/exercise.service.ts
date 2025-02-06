import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";
import { IExercise } from "./exercise.interface";
import Exercise from "./exercise.model";

// Create a new exercise
const createExercise = async (exerciseData: IExercise) => {
  const exercise = await Exercise.create(exerciseData);
  return exercise;
};

// Get all exercises
const getAllExercise = async () => {
  return await Exercise.find().exec();
};

// Get an exercise by ID
const getExerciseById = async (exerciseId: string) => {
  return await Exercise.findById(exerciseId).exec();
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

  unlinkFile(isExist.video as string);

  const updated = await Exercise.findByIdAndUpdate(exerciseId, updateData, {
    new: true,
  }).exec();

  if (!updated?._id) {
    throw new AppError(404, "Failed to Update");
  }
  return updated;
};

// Delete an exercise by ID
const deleteExercise = async (exerciseId: string): Promise<void> => {
  const isExist = await Exercise.findById(exerciseId);
  if (!isExist?._id) {
    throw new AppError(404, "Workout not found.");
  }
  unlinkFile(isExist.video as string);

  await Exercise.findByIdAndDelete(exerciseId).exec();
};

// Group all service functions into an object
export const ExerciseService = {
  createExercise,
  getAllExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
