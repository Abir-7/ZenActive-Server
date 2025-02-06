import { Request, Response } from "express";

import httpStatus from "http-status";

import { Types } from "mongoose";
import { DailyExerciseService } from "./dailyExercise.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create a new daily exercise record
const createDailyExercise = catchAsync(async (req: Request, res: Response) => {
  const dailyExerciseData = req.body;
  const result = await DailyExerciseService.createDailyExercise({
    ...dailyExerciseData,
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

export const DailyExerciseController = {
  createDailyExercise,
  getDailyExerciseById,
};
