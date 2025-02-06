import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { BlockService } from "./blockList.service";

const addToBlock = catchAsync(async (req, res) => {
  const { blockedUserkId } = req.body;
  const userId = req.user.userId;
  const result = await BlockService.addToBlock(blockedUserkId, userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User has been successfully added to the blocklist.",
  });
});

const deleteFromBlock = catchAsync(async (req, res) => {
  const { blockedUserkId } = req.body;
  const userId = req.user.userId;
  const result = await BlockService.deleteFromBlock(blockedUserkId, userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User has been successfully removed from the blocklist.",
  });
});

const getBlockList = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const friendList = await BlockService.getBlockList(userId);
  sendResponse(res, {
    data: friendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Block list fetched successfully.",
  });
});

export const BlockController = {
  deleteFromBlock,
  addToBlock,
  getBlockList,
};
