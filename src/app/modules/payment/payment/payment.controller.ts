import { handleNewSubscription } from "../../../socket/notification/subscriptionNotification";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import httpStatus from "http-status";
import { PaymentService } from "./payment.service";

const getMySubscription = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await PaymentService.getUserSubscription(userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription data fetched successfully.",
  });
});

const getUserPaymentData = catchAsync(async (req, res) => {
  const result = await PaymentService.getUserPaymentData(
    req.query.type as "weekly" | "monthly"
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Earn data fetched successfully.",
  });
});

const getAllTransection = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllTransection(req.query);
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription data are fetched successfully.",
  });
});

const getTotalEarnings = catchAsync(async (req, res) => {
  const result = await PaymentService.getTotalEarnings();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TotalEarning  data are fetched successfully.",
  });
});
const webHookHandler = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await PaymentService.webHookHandler(req.body.event);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TotalEarning  data are fetched successfully.",
  });
});

export const PaymentController = {
  getMySubscription,
  getUserPaymentData,
  getAllTransection,
  getTotalEarnings,
  webHookHandler,
};
