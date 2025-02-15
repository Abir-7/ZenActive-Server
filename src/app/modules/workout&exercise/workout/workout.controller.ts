import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import sendResponse from "../../../utils/sendResponse";
import { WorkoutService } from "./workout.service";
import catchAsync from "../../../utils/catchAsync";

const createWorkout = catchAsync(async (req: Request, res: Response) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };

  const result = await WorkoutService.createWorkout(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout created successfully.",
  });
});

const getAllWorkouts = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkoutService.getAllWorkouts(req.query);
  sendResponse(res, {
    data: result.result,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workouts fetched successfully.",
  });
});

const getWorkoutById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WorkoutService.getWorkoutById(new Types.ObjectId(id));
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout fetched successfully.",
  });
});

const getWorkoutsExerciseById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;

    const result = await WorkoutService.getWorkoutsExerciseById(
      new Types.ObjectId(id),
      userId
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "User workout data fetched successfully.",
    });
  }
);

const updateWorkout = catchAsync(async (req: Request, res: Response) => {
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
  const result = await WorkoutService.updateWorkout(
    new Types.ObjectId(id),
    value
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout updated successfully.",
  });
});

const deleteWorkout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await WorkoutService.deleteWorkout(new Types.ObjectId(id));
  sendResponse(res, {
    data: null,
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Workout deleted successfully.",
  });
});

const addExerciseToWorkout = catchAsync(async (req: Request, res: Response) => {
  const { workoutId, exerciseId } = req.body;
  const result = await WorkoutService.addExerciseToWorkout(
    workoutId,
    exerciseId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Exercise added to workout successfully.",
  });
});

const removeExerciseFromWorkout = catchAsync(
  async (req: Request, res: Response) => {
    const { workoutId, exerciseId } = req.body;
    const result = await WorkoutService.removeExerciseFromWorkout(
      workoutId,
      exerciseId
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "Exercise removed from workout successfully.",
    });
  }
);

export const WorkoutController = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  getWorkoutsExerciseById,
};
