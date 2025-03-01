import { Request, Response } from "express";
import { WorkoutVideoService } from "./workoutVideo.service";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import getVideoDurationInSeconds from "get-video-duration";

const getAllWorkoutVideos = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await WorkoutVideoService.getAllWorkoutVideos(
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout videos fetched successfully.",
  });
});

const getSingleWorkoutVideos = catchAsync(
  async (req: Request, res: Response) => {
    const result = await WorkoutVideoService.getSingleWorkoutVideos(
      req.params.id
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "Workout video is fetched successfully.",
    });
  }
);
const createWorkoutVideo = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkoutVideoService.createWorkoutVideo(req);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout video created successfully.",
  });
});
const updateWorkoutVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await WorkoutVideoService.updateWorkoutVideo(id, req);
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
  getSingleWorkoutVideos,
};
