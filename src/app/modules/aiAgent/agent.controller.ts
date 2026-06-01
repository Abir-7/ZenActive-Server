import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { processQuery } from "./agent";

const generateWorkoutPlan = catchAsync(async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const result = await processQuery(prompt);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workout plan generated successfully",
    data: result,
  });
});

export const AIAgentController = {
  generateWorkoutPlan,
};
