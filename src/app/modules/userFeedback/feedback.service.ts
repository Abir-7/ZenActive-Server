import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { WorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.model";
import UserWorkoutPlanFeedback from "./feedback.model";

const giveWorkoutPlanFeedback = async (data: {
  planId: string;
  isAllExcerciseComplete: boolean;
  challengesFace: string;
}) => {
  const isExist = await WorkoutPlan.findById(data.planId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Workout plan not found.");
  }

  const feedback = await UserWorkoutPlanFeedback.create(data);
  return feedback;
};

const getAllWorkoutPlanWithFeedback = async () => {
  const workoutPlans = await WorkoutPlan.aggregate([
    {
      $lookup: {
        from: "userworkoutplanfeedbacks", // Collection name in lowercase
        localField: "_id",
        foreignField: "planId",
        as: "feedbacks",
      },
    },
  ]);

  return workoutPlans;
};

export const FeedbackService = {
  giveWorkoutPlanFeedback,
  getAllWorkoutPlanWithFeedback,
};
