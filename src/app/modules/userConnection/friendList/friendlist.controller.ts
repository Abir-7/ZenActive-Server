import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { FriendListService } from "./friendlist.service";
import sendResponse from "../../../utils/sendResponse";
import mongoose from "mongoose";

// Add a friend to the user's friend list
const addFriend = catchAsync(async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  const updatedFriendList = await FriendListService.sendRequest(
    userId,
    friendId
  );
  sendResponse(res, {
    data: updatedFriendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Request sent successfully.",
  });
});

const acceteptRequest = catchAsync(async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  const updatedFriendList = await FriendListService.acceteptRequest(
    userId,
    friendId
  );
  sendResponse(res, {
    data: updatedFriendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Request accepted successfully.",
  });
});

const removeFriend = catchAsync(async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  const updatedFriendList = await FriendListService.removeFriend(
    userId,
    friendId
  );
  sendResponse(res, {
    data: updatedFriendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "User unfriend successfully.",
  });
});

const getFriendList = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const friendList = await FriendListService.getFriendList(userId);
  sendResponse(res, {
    data: friendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Friend list fetched successfully.",
  });
});

const getPendingList = catchAsync(async (req, res) => {
  const { type } = req.query;
  const userId = req.user.userId;

  const friendList = await FriendListService.getPendingList(
    userId,
    type as string
  );
  sendResponse(res, {
    data: friendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Pending list fetched successfully.",
  });
});

const getSugestedFriend = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { email } = req.query;
  const friendList = await FriendListService.suggestedFriend(
    userId,
    email as string
  );
  sendResponse(res, {
    data: friendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Sugested friend list fetched successfully.",
  });
});

const addToBlock = catchAsync(async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  const result = await FriendListService.addToBlock(friendId, userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User has been successfully added to the blocklist.",
  });
});

const removeRequest = catchAsync(async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  const updatedFriendList = await FriendListService.removeRequest(
    userId,
    friendId
  );
  sendResponse(res, {
    data: updatedFriendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "User request removed successfully.",
  });
});

const getFriendListWithLastMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const updatedFriendList =
    await FriendListService.getFriendListWithLastMessage(userObjectId);
  sendResponse(res, {
    data: updatedFriendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Friend with last message fetched successfully.",
  });
});

export const FriendListController = {
  addFriend,
  removeFriend,
  getFriendList,
  getSugestedFriend,
  acceteptRequest,
  getPendingList,
  addToBlock,
  removeRequest,
  getFriendListWithLastMessage,
};
