import status from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import SubscriptionPlan from "./subscriptionPlan.model";

export const getAllSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionPlan.find();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.CREATED,
    message: "Data are fetched successfully.",
  });
});
