import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserMealPlanService } from "./userMealPlan.service";

const createUserMealPlan = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const mealPlan = await UserMealPlanService.createUserMealPlan(
    userId,
    req.body.mealIds
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User meal plan created successfully",
    data: mealPlan,
  });
});

const getUserMealPlans = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const mealPlans = await UserMealPlanService.getUserMealPlans(
    userId,
    req.query.mealStatus as "" | "completed"
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User meal plans fetched successfully",
    data: mealPlans,
  });
});

// export const getUserMealPlanById = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const mealPlan = await UserMealPlanService.getUserMealPlanById(id);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "User meal plan fetched successfully",
//       data: mealPlan,
//     });
//   }
// );

const updateUserMealPlan = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const mealPlan = await UserMealPlanService.updateUserMealPlan(
    userId,
    req.params?.mealId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User meal plan updated successfully",
    data: mealPlan,
  });
});

const deleteUserMealPlan = catchAsync(async (req: Request, res: Response) => {
  await UserMealPlanService.deleteUserMealPlan(req.params.id, req.user.userId);
  sendResponse(res, {
    data: { message: "Meal plans deleted" },
    statusCode: 200,
    success: true,
    message: "User meal plan deleted successfully",
  });
});

export const UserMealPlanController = {
  createUserMealPlan,
  getUserMealPlans,
  updateUserMealPlan,
  deleteUserMealPlan,
};
