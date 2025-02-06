import { Types } from "mongoose";

import Friend from "./friendlist.model";
import { User } from "../../user/user.model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import { Block } from "../blocklist/blockList.model";
const sendRequest = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const existingFriendList = await Friend.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });

  if (existingFriendList && existingFriendList.isAccepted == true) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already friend.");
  }
  if (existingFriendList && !existingFriendList?.isAccepted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already sent request");
  }
  const sendRequest = await Friend.create({
    senderId: userId,
    receiverId: friendId,
  });
  return sendRequest;
};

const acceteptRequest = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const friendList = await Friend.findOne({
    senderId: friendId,
    receiverId: userId,
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  const acceptUserRequest = await Friend.findOneAndUpdate(
    {
      senderId: friendId,
      receiverId: userId,
    },
    { isAccepted: true },
    { new: true }
  );
  return acceptUserRequest;
};

const removeFriend = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const friendList = await Friend.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  await Friend.findOneAndDelete({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });
  return { message: "Removed" };
};

const getFriendList = async (userId: string) => {
  const friendList = await Friend.find(
    {
      $or: [{ senderId: userId }, { receiverId: userId }],
      isAccepted: true,
    },
    { senderId: 1, receiverId: 1 }
  )
    .populate({
      path: "senderId",
      select: "_id email image name",
      options: { lean: true },
    })
    .populate({
      path: "receiverId",
      select: "_id email image name",
      options: { lean: true },
    })
    .lean();

  return friendList.map((friend) =>
    friend.senderId._id.toString() === userId
      ? friend.receiverId
      : friend.senderId
  );
};

const getPendingList = async (userId: string, type: string) => {
  const pendingRequests = await Friend.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    isAccepted: false,
  })
    .populate({
      path: "senderId",
      select: "_id email image name",
      options: { lean: true },
    })
    .populate({
      path: "receiverId",
      select: "_id email image name",
      options: { lean: true },
    })
    .lean();

  if (!type) {
    throw new AppError(httpStatus.BAD_REQUEST, "type query missing...");
  }

  if (type === "sendRequestList") {
    return {
      sendRequestList: pendingRequests
        .filter((req) => req.senderId._id.toString() === userId)
        .map((req) =>
          req.senderId._id.toString() === userId ? req.receiverId : req.senderId
        ),
    };
  }
  if (type === "requestedList") {
    return {
      requestedList: pendingRequests
        .filter((req) => req.receiverId._id.toString() === userId)
        .map((req) =>
          req.senderId._id.toString() === userId ? req.receiverId : req.senderId
        ),
    };
  }
};

const suggestedFriend = async (userId: string) => {
  const userFriends = await Friend.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  // Get friend IDs
  const friendIds = userFriends.map((friend) => {
    return friend.senderId.toString() === userId
      ? friend.receiverId
      : friend.senderId;
  });

  // Exclude friends and blocked users from suggestion
  const blockedUsers = await Block.findOne({ userId });
  const blockedUserIds = blockedUsers ? blockedUsers.blockedUser : [];

  // Find other users who are not friends or blocked
  const suggestedUsers = await User.find({
    _id: { $ne: userId, $nin: [...friendIds, ...blockedUserIds] },
    role: "USER",
  }).select("_id email image name");

  return suggestedUsers;
};

export const FriendListService = {
  sendRequest,
  removeFriend,
  getFriendList,
  suggestedFriend,
  acceteptRequest,
  getPendingList,
};
