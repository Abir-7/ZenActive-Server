import httpStatus from "http-status";
import Exercise from "../workout&exercise/exercise/exercise.model";
import { IDailyExercise } from "./dailyExercise.interface";
import DailyExercise from "./dailyExercise.model";
import AppError from "../../errors/AppError";
import { UserAppData } from "../userAppData/appdata.model";
import DailyChallenge from "../usersDailyChallage/usersDailyExercise.model";

const createDailyExercise = async (dailyExerciseData: IDailyExercise) => {
  const exerciseData = await Exercise.findOne({
    _id: dailyExerciseData.exerciseId,
  });

  if (!exerciseData) {
    throw new AppError(httpStatus.NOT_FOUND, "Exercise  not found.");
  }

  const appData = await UserAppData.findOne({
    userId: dailyExerciseData.userId,
  });

  if (!appData) {
    throw new AppError(httpStatus.NOT_FOUND, "Appdata  not found.");
  }

  appData.points = appData?.points
    ? appData?.points + exerciseData.points
    : 0 + exerciseData.points;
  appData.completedWorkoutTime = appData?.completedWorkoutTime
    ? appData?.completedWorkoutTime + exerciseData.duration
    : 0 + exerciseData.duration;
  await appData.save();
  const dailyExercise = await DailyExercise.create(dailyExerciseData);
  return dailyExercise;
};

const getDailyExerciseById = async (dailyExerciseId: string) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await DailyExercise.find({
    exerciseId: dailyExerciseId,
    completedDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });
};

const getDailyChallenge = async () => {
  const result = await DailyChallenge.find().populate("exerciseId");
  return result.map((exercise) => {
    return exercise.exerciseId;
  });
};

export const DailyExerciseService = {
  createDailyExercise,
  getDailyExerciseById,
  getDailyChallenge,
};
