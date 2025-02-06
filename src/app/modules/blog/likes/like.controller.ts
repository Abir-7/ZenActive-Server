import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { LikeService } from "./like.service";
import httpStatus from "http-status";
const toggleLike = catchAsync(async (req, res) => {
  const { postId } = req.body;
  const { userId } = req.user;

  const result = await LikeService.toggleLike(postId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Like status updated successfully.",
  });
});

export const LikeController = {
  toggleLike,
};
