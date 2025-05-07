import { handleNewSubscription } from "../../../socket/notification/subscriptionNotification";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import httpStatus from "http-status";
import { PaymentService } from "./payment.service";

const createUserPayment = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const subscriptionData = req.body;

  const result = await PaymentService.createUserPayment(
    subscriptionData,
    userId
  );

  handleNewSubscription(
    `  You have received ${subscriptionData.packagePrice}  from user:${subscriptionData.userId}`
  );

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription created successfully.",
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

export const PaymentController = {
  createUserPayment,
  getUserPaymentData,
  getAllTransection,
  getTotalEarnings,
};
