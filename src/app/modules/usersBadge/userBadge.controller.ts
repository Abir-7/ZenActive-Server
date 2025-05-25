import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserBadgeService } from "./userBadge.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import mongoose from "mongoose";

const createOrUpdateUserBadge = catchAsync(
  async (req: Request, res: Response) => {
    const { badgeId } = req.body;
    const { userId } = req.user;
    const result = await UserBadgeService.createOrUpdateUserBadge(
      userId,
      badgeId
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User badge relationship created/updated successfully.",
    });
  }
);

const getUserBadgeById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await UserBadgeService.getUserBadgeById(userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User badge relationship fetched successfully.",
  });
});

export const UserBadgeController = {
  createOrUpdateUserBadge,

  getUserBadgeById,
};
