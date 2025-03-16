import { Request, Response } from "express";
import httpStatus from "http-status";
import { NotificationService } from "./notification.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

// const createNotification = catchAsync(async (req: Request, res: Response) => {
//   const result = await NotificationService.createNotification(req.body);
//   sendResponse(res, {
//     data: result,
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Notification created successfully.",
//   });
// });

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 20 } = req.query;
  const result = await NotificationService.getAllNotifications(
    userId,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications fetched successfully.",
  });
});

const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.updateNotification(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification updated successfully.",
  });
});

const sendPushNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.sendPushNotification(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Push Notification sent successfully.",
  });
});

export const NotificationController = {
  getAllNotifications,
  updateNotification,
  sendPushNotification,
};
