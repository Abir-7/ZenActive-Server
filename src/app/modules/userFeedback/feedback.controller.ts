import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeedbackService } from "./feedback.service";

const giveWorkoutPlanFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackService.giveWorkoutPlanFeedback(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User feedback given successfully.",
    data: result,
  });
});

const getAllWorkoutPlanWithFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackService.getAllWorkoutPlanWithFeedback();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Workout plan with  feedback are fetched successfully.",
    data: result,
  });
});

export const FeedbackController = {
  giveWorkoutPlanFeedback,
  getAllWorkoutPlanWithFeedback,
};
