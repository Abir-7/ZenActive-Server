import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppDataService } from "./appdata.service";

const addPoints = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { points } = req.body;
  const result = await AppDataService.addPoints(points, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User app data updated successfully.",
    data: result,
  });
});

export const AppDataController = {
  addPoints,
};
