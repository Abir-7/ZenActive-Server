import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { WorkoutPlanService } from "./workoutPlan.service";

export const createWorkoutPlan = catchAsync(async (req, res) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };

  const result = await WorkoutPlanService.createWorkoutPlan(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout plan successfully created.",
  });
});

const updateWorkoutPlan = catchAsync(async (req, res) => {
  const id = req.params.id;

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

  const result = await WorkoutPlanService.updateWorkout(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout successfully updated.",
  });
});

const getAllWorkoutsPlan = catchAsync(async (req, res) => {
  const result = await WorkoutPlanService.getAllWorkouts(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "All workout plans fetched successfully.",
  });
});

const getSingleWorkoutPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await WorkoutPlanService.getSingleWorkout(id, req.user.userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout plan is fetched successfully.",
  });
});

const getSingleWorkoutPlanDefault = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await WorkoutPlanService.getSingleWorkoutDefault(id);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout plan is fetched successfully.",
  });
});

const deleteWorkoutPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await WorkoutPlanService.deleteWorkout(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout plan is successfully deleted.",
  });
});

export const WorkoutPlanController = {
  updateWorkoutPlan,
  createWorkoutPlan,
  getAllWorkoutsPlan,
  getSingleWorkoutPlan,
  deleteWorkoutPlan,
  getSingleWorkoutPlanDefault,
};
