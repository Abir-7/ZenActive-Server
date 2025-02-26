import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppDataService } from "./appdata.service";

const addPoints = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { points } = req.body;
  const result = await AppDataService.addPoints(points, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User app data points updated successfully.",
    data: result,
  });
});
const addWorkoutTime = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { time } = req.body;

  const result = await AppDataService.addWorkoutTime(time, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User app data workout time updated successfully.",
    data: result,
  });
});
const getLeaderboard = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const result = await AppDataService.getLeaderboard(
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User leaderboard fetched successfully.",
    data: result.data,
    meta: result.meta,
  });
});
export const AppDataController = {
  addPoints,
  addWorkoutTime,
  getLeaderboard,
};
