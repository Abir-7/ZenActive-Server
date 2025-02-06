import { Request, Response } from "express";

import httpStatus from "http-status";

import { UserWorkoutPlanService } from "./userWorkoutPlan.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Start a new workout plan for a user
const startWorkoutPlan = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workoutPlanId } = req.body;
  const result = await UserWorkoutPlanService.startWorkoutPlan(
    userId,
    workoutPlanId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout plan started successfully.",
  });
});

// Update the present workout in a user's workout plan
const updatePresentWorkout = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { userId } = req.user;
  const result = await UserWorkoutPlanService.updatePresentWorkout(
    userId,
    planId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Present workout updated successfully.",
  });
});

// Get a user's active workout plan
const getActiveWorkoutPlan = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { userId } = req.user;
  const result = await UserWorkoutPlanService.getActiveWorkoutPlan(
    userId,
    planId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Active workout plan fetched successfully.",
  });
});

export const UserWorkoutPlanController = {
  startWorkoutPlan,
  updatePresentWorkout,

  getActiveWorkoutPlan,
};
