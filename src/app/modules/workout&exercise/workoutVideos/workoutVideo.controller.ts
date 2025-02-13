import { Request, Response } from "express";
import { WorkoutVideoService } from "./workoutVideo.service";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
const { getVideoDurationInSeconds } = require("get-video-duration");

const getAllWorkoutVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkoutVideoService.getAllWorkoutVideos();
  sendResponse(res, {
    data: result,
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
  let image = null;
  let video = null;
  let duration = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  if (req.files && "media" in req.files && req.files.media[0]) {
    video = `/medias/${req.files.media[0].filename}`;
    console.log();

    await getVideoDurationInSeconds(req.files.media[0].path)
      .then((durations: number) => {
        duration = durations;
        console.log(`Video Duration: ${durations} seconds`);
      })
      .catch((error: any) => {
        throw new Error("Failed to get durattion");
      });
  }

  const value = {
    ...req.body,
    image,
    video,
    duration,
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
  let video = null;
  let value = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  if (req.files && "media" in req.files && req.files.media[0]) {
    video = `/medias/${req.files.media[0].filename}`;
  }
  if (image && video) {
    value = {
      ...req.body,
      image,
      video,
    };
  } else if (video) {
    value = {
      ...req.body,
      video,
    };
  } else if (image) {
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
  getSingleWorkoutVideos,
};
