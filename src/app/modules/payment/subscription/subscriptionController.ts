import status from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import SubscriptionPlan from "./subscription.model";

export const getAllSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionPlan.find();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.CREATED,
    message: "TotalEarning  data are fetched successfully.",
  });
});
