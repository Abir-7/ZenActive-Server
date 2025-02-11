import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ExerciseService } from "./exercise.service";

const createExercise = catchAsync(async (req: Request, res: Response) => {
  let video = null;
  let image = null;
  if (req.files && "media" in req.files && req.files.media[0]) {
    video = `/medias/${req.files.media[0].filename}`;
  }

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    video,
    image,
  };

  const result = await ExerciseService.createExercise(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Exercise created successfully.",
  });
});

// Get all exercises
const getAllExercise = catchAsync(async (req: Request, res: Response) => {
  const result = await ExerciseService.getAllExercise();
  sendResponse(res, {
    data: result,
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
  const updateData = req.body;

  let video = null;
  let value = null;
  if (req.files && "media" in req.files && req.files.media[0]) {
    video = `/medias/${req.files.media[0].filename}`;
  }

  if (video) {
    value = {
      ...req.body,
      video,
    };
  } else {
    value = req.body;
  }

  const result = await ExerciseService.updateExercise(id, value);
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
