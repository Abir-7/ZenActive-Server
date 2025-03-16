import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ExerciseService } from "./exercise.service";

const createExercise = catchAsync(async (req: Request, res: Response) => {
  const result = await ExerciseService.createExercise(req);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Exercise created successfully.",
  });
});

// Get all exercises
const getAllExercise = catchAsync(async (req: Request, res: Response) => {
  const { userRole, userId } = req.user;
  const { page = 1, limit = 15, name } = req.query;

  const result = await ExerciseService.getAllExercise(
    userRole,
    userId,
    Number(page),
    Number(limit),
    { name: name }
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Exercise fetched successfully.",
  });
});

// Get an exercise by ID
const getExerciseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ExerciseService.getExerciseById(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Exercise fetched successfully.",
  });
});

// Update an exercise by ID
const updateExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ExerciseService.updateExercise(id, req);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Exercise updated successfully.",
  });
});

// Delete an exercise by ID
const deleteExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ExerciseService.deleteExercise(id);
  sendResponse(res, {
    data: { message: "Exercise deleted successfully." },
    success: true,
    statusCode: httpStatus.OK,
    message: "Exercise deleted successfully.",
  });
});

// Group all controller functions into an object
export const WorkoutController = {
  createExercise,
  deleteExercise,
  getAllExercise,
  getExerciseById,
  updateExercise,
};
