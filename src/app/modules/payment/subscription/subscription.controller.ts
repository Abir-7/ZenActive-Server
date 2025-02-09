import { handleNewSubscription } from "../../../socket/notification/subscriptionNotification";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { SubscriptionService } from "./subscription.service";
import httpStatus from "http-status";

const createSubscription = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const subscriptionData = req.body as ISubscription;

  const result = await SubscriptionService.createSubscription(
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

const getSubscriptionData = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSubscriptionData(
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
  const result = await SubscriptionService.getAllTransection(req.query);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription data are fetched successfully.",
  });
});

export const SubscriptionController = {
  createSubscription,
  getSubscriptionData,
  getAllTransection,
};
