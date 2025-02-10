import { Request, Response } from "express";
import { WorkoutVideoService } from "./workoutVideo.service";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const getAllWorkoutVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkoutVideoService.getAllWorkoutVideos();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout videos fetched successfully.",
  });
});

const createWorkoutVideo = catchAsync(async (req: Request, res: Response) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };
  const result = await WorkoutVideoService.createWorkoutVideo(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout video created successfully.",
  });
});

const updateWorkoutVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  let image = null;
  let value = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  if (image) {
    value = {
      ...req.body,
      image,
    };
  } else {
    value = req.body;
  }

  const result = await WorkoutVideoService.updateWorkoutVideo(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout video updated successfully.",
  });
});

const deleteWorkoutVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await WorkoutVideoService.deleteWorkoutVideo(id);
  sendResponse(res, {
    data: null,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout video deleted successfully.",
  });
});

export const WorkoutVideoController = {
  getAllWorkoutVideos,
  createWorkoutVideo,
  updateWorkoutVideo,
  deleteWorkoutVideo,
};
