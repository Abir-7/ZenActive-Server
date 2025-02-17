import AppError from "../../errors/AppError";
import { UserAppData } from "./appdata.model";
import httpStatus from "http-status";
const addPoints = async (point: number, userId: string) => {
  const appData = await UserAppData.findOne({ userId });
  if (!appData) {
    throw new AppError(httpStatus.NOT_FOUND, "User app data not found.");
  }

  appData.points = (appData?.points || 0) + point;
  await appData.save();
  return appData;
};

const addWorkoutTime = async (time: number, userId: string) => {
  const appData = await UserAppData.findOne({ userId });
  if (!appData) {
    throw new AppError(httpStatus.NOT_FOUND, "User app data not found.");
  }
  appData.completedWorkoutTime = (appData?.completedWorkoutTime || 0) + time;
  await appData.save();
  return appData;
};

export const AppDataService = {
  addPoints,
  addWorkoutTime,
};
