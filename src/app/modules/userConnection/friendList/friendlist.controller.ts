import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { FriendListService } from "./friendlist.service";
import sendResponse from "../../../utils/sendResponse";

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
    message: "Removed successfully.",
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
    message: "Sugested Friend list fetched successfully.",
  });
});

const getSugestedFriend = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const friendList = await FriendListService.suggestedFriend(userId);
  sendResponse(res, {
    data: friendList,
    success: true,
    statusCode: httpStatus.OK,
    message: "Sugested Friend list fetched successfully.",
  });
});

export const FriendListController = {
  addFriend,
  removeFriend,
  getFriendList,
  getSugestedFriend,
  acceteptRequest,
  getPendingList,
};
