import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import sendResponse from "../../../utils/sendResponse";
import { WorkoutService } from "./workout.service";
import catchAsync from "../../../utils/catchAsync";

const createWorkout = catchAsync(async (req: Request, res: Response) => {
  const workoutData = req.body;
  const result = await WorkoutService.createWorkout(workoutData);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout created successfully.",
  });
});

const getAllWorkouts = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkoutService.getAllWorkouts();
  sendResponse(res, {
    data: result,
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

const updateWorkout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await WorkoutService.updateWorkout(
    new Types.ObjectId(id),
    updateData
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
    new Types.ObjectId(workoutId),
    new Types.ObjectId(exerciseId)
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
      new Types.ObjectId(workoutId),
      new Types.ObjectId(exerciseId)
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
};
