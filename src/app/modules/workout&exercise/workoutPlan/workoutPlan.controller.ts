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

  const result = await WorkoutPlanService.createWorkout(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workout plan successfully created.",
  });
});

const updateWorkoutPlan = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await WorkoutPlanService.updateWorkout(id, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Workout successfully updated.",
  });
});

const getAllWorkoutsPlan = catchAsync(async (req, res) => {
  const result = await WorkoutPlanService.getAllWorkouts();

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "All workout plans fetched successfully.",
  });
});

const getSingleWorkoutPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await WorkoutPlanService.getSingleWorkout(id);

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
    statusCode: httpStatus.NO_CONTENT,
    message: "Workout plan is successfully deleted.",
  });
});

export const WorkoutPlanController = {
  updateWorkoutPlan,
  createWorkoutPlan,
  getAllWorkoutsPlan,
  getSingleWorkoutPlan,
  deleteWorkoutPlan,
};
