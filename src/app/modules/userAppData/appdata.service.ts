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

const getLeaderboard = async (page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await UserAppData.countDocuments();
  const totalPage = Math.ceil(total / limit);

  // Fetch leaderboard sorted by points in descending order
  const leaderboard = await UserAppData.find()
    .populate({
      path: "userId",
      select: "_id name email image",
      options: { lean: true },
    })
    .sort({ points: -1 }) // Sorting by points (descending)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    meta: { limit, page, total, totalPage },
    data: leaderboard,
  };
};

export const AppDataService = {
  addPoints,
  addWorkoutTime,
  getLeaderboard,
};
