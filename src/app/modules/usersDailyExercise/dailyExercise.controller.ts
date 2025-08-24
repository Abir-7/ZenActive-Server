import { Request, Response } from "express";

import httpStatus from "http-status";

import { DailyExerciseService } from "./dailyExercise.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create a new daily exercise record
const createDailyExercise = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const dailyExerciseData = req.body;
  const result = await DailyExerciseService.createDailyExercise({
    ...dailyExerciseData,
    userId,
    completedDate: new Date(Date.now()),
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Daily exercise record created successfully.",
  });
});

// Get a daily exercise record by ID
const getDailyExerciseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DailyExerciseService.getDailyExerciseById(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Daily exercise record fetched successfully.",
  });
});

const getDailyChallenge = catchAsync(async (req: Request, res: Response) => {
  const result = await DailyExerciseService.getDailyChallenge(req.user.userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Daily challenge record fetched successfully.",
  });
});

export const DailyExerciseController = {
  createDailyExercise,
  getDailyExerciseById,
  getDailyChallenge,
};
