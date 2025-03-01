import mongoose, { Types } from "mongoose";

import { User } from "../../user/user.model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
// import { Block } from "../blocklist/blockList.model";
import UserConnection from "./friendlist.model";
import { status } from "./friendlist.interface";
import { Notification } from "../../notification/notification.model";
import { NotificationType } from "../../notification/notification.interface";
import { handleNotification } from "../../../socket/notification/handleNotification";
const sendRequest = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const senderData = await User.findById(userId).select("name");
  console.log(senderData);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingFriendList = await UserConnection.findOne({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).session(session);

    if (existingFriendList) {
      if (existingFriendList.isAccepted) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already friends.");
      }
      throw new AppError(httpStatus.BAD_REQUEST, "Already sent request");
    }

    await Notification.create(
      [
        {
          senderId: userId,
          receiverId: friendId,
          type: NotificationType.FRIEND_REQUEST,
          message: `\`${
            senderData?.name?.firstName +
            (senderData?.name?.lastName ? " " + senderData.name.lastName : "")
          }\` sent you a friend requiest.`,
        },
      ],
      { session }
    );

    handleNotification("You have a new friend request", String(friendId));

    const sendRequest = await UserConnection.create(
      [{ senderId: userId, receiverId: friendId }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return sendRequest[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const acceteptRequest = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const friendList = await UserConnection.findOne({
    senderId: friendId,
    receiverId: userId,
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  const acceptUserRequest = await UserConnection.findOneAndUpdate(
    {
      senderId: friendId,
      receiverId: userId,
    },
    { isAccepted: true },
    { new: true }
  );
  return acceptUserRequest;
};

const getFriendList = async (
  userId: string,
  searchText?: string,
  page: number = 1,
  limit: number = 30
) => {
  const skip = (page - 1) * limit;

  const friendList = await UserConnection.find(
    {
      $or: [{ senderId: userId }, { receiverId: userId }],
      isAccepted: true,
      status: null,
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
    .skip(skip) // Apply pagination at the database level
    .limit(limit)
    .lean();

  // Extract only the friend data
  let friends = friendList.map((friend) =>
    friend.senderId._id.toString() === userId
      ? friend.receiverId
      : friend.senderId
  ) as any[];

  // 🔍 Search by full name (case-insensitive)
  if (searchText) {
    const searchRegex = new RegExp(searchText, "i"); // Case-insensitive search
    friends = friends.filter((friend) => {
      const fullName = `${friend.name?.firstName} ${friend?.name?.lastName}`;
      return searchRegex.test(fullName);
    });
  }

  // Get total count for pagination
  const total = friends.length;
  const totalPage = Math.ceil(total / limit);

  // Apply pagination
  const paginatedFriends = friends.slice(skip, skip + limit);

  return {
    meta: { limit, page, total, totalPage },
    data: paginatedFriends,
  };
};

const getPendingList = async (
  userId: string,
  type: string,
  page: number = 1,
  limit: number = 30
) => {
  if (!type) {
    throw new AppError(httpStatus.BAD_REQUEST, "type query missing...");
  }

  const skip = (page - 1) * limit;

  const pendingRequests = await UserConnection.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    isAccepted: false,
    status: null,
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

  let filteredList = [];

  if (type === "sendRequestList") {
    filteredList = pendingRequests
      .filter((req) => req.senderId._id.toString() === userId)
      .map((req) =>
        req.senderId._id.toString() === userId ? req.receiverId : req.senderId
      );
  } else if (type === "requestedList") {
    filteredList = pendingRequests
      .filter((req) => req.receiverId._id.toString() === userId)
      .map((req) =>
        req.senderId._id.toString() === userId ? req.receiverId : req.senderId
      );
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid type query...");
  }

  // Get total count for pagination
  const total = filteredList.length;
  const totalPage = Math.ceil(total / limit);

  // Apply pagination
  const paginatedList = filteredList.slice(skip, skip + limit);

  return {
    meta: { limit, page, total, totalPage },
    data: paginatedList,
  };
};

const suggestedFriend = async (
  myUserId: string,
  email: string,
  page: number = 1,
  limit: number = 30
) => {
  const skip = (page - 1) * limit;

  // Step 1: Find all users who are in a relationship with you (either as sender or receiver)
  const relationships = await UserConnection.find({
    $or: [{ senderId: myUserId }, { receiverId: myUserId }],
  });

  // Extract the user IDs from the relationships
  const relatedUserIds = relationships.map((rel) =>
    rel.senderId.toString() === myUserId
      ? rel.receiverId.toString()
      : rel.senderId.toString()
  );

  // Add your own ID to the relatedUserIds array
  relatedUserIds.push(myUserId);

  const query: any = {
    _id: { $nin: relatedUserIds },
    role: "USER",
  };

  // Add the email condition if an email is provided
  if (email) {
    query.email = { $regex: email, $options: "i" }; // Case-insensitive search by email
  }

  // Step 2: Get total count for pagination
  const total = await User.countDocuments(query);
  const totalPage = Math.ceil(total / limit);

  // Step 3: Find all users who are not in the relatedUserIds list
  const suggestedFriends = await User.find(query)
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    meta: { limit, page, total, totalPage },
    data: suggestedFriends,
  };
};

const removeFriend = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const friendList = await UserConnection.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  await UserConnection.findOneAndUpdate(
    {
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    { status: "unfriend", statusChangeBy: userId, isAccepted: false },
    { new: true }
  );
  return { message: "User Unfriend." };
};

const addToBlock = async (friendId: Types.ObjectId, userId: Types.ObjectId) => {
  const friendList = await UserConnection.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  await UserConnection.findOneAndUpdate(
    {
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    { status: "blocked", statusChangeBy: userId, isAccepted: false },
    { new: true }
  );
  return { message: "User Blocked" };
};

const removeRequest = async (
  userId: Types.ObjectId,
  friendId: Types.ObjectId
) => {
  const friendList = await UserConnection.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
    isAccepted: false,
  });
  if (!friendList) {
    throw new AppError(httpStatus.BAD_REQUEST, "Connection not found");
  }
  await UserConnection.findOneAndDelete({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
    isAccepted: false,
  });
  return { message: "User Request Deleted" };
};

async function getFriendListWithLastMessage(userId: Types.ObjectId) {
  const friendListWithMessages = await UserConnection.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: true,
      },
    },
    {
      $lookup: {
        from: "users", // Assuming 'users' is the collection name for the User model
        let: { senderId: "$senderId", receiverId: "$receiverId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$_id", "$$senderId"] },
                  { $eq: ["$_id", "$$receiverId"] },
                ],
              },
            },
          },
          {
            $project: {
              name: 1,
              email: 1,
              image: 1,
              _id: 1,
            },
          },
        ],
        as: "friendDetails",
      },
    },
    {
      $unwind: {
        path: "$friendDetails",
      },
    },
    {
      $lookup: {
        from: "chats",
        let: { senderId: "$senderId", receiverId: "$receiverId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ["$senderId", "$$senderId"] },
                      { $eq: ["$receiverId", "$$receiverId"] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ["$senderId", "$$receiverId"] },
                      { $eq: ["$receiverId", "$$senderId"] },
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } }, // Sort messages by most recent
          { $limit: 1 }, // Get only the latest message
        ],
        as: "lastMessage",
      },
    },
    {
      $unwind: {
        path: "$lastMessage",
        preserveNullAndEmptyArrays: true, // Include friends even if there's no message
      },
    },
    {
      $project: {
        friendDetails: 1,
        lastMessage: 1,
      },
    },
    {
      $match: {
        lastMessage: { $ne: null }, // Exclude friends with no messages
        "friendDetails._id": { $ne: userId }, // Exclude the user from the friend list
      },
    },
    {
      $sort: {
        "lastMessage.createdAt": -1, // Sort by the last message's createdAt time in descending order
      },
    },
  ]);

  return friendListWithMessages;
}

export const FriendListService = {
  sendRequest,
  removeFriend,
  getFriendList,
  suggestedFriend,
  acceteptRequest,
  getPendingList,
  addToBlock,
  removeRequest,
  getFriendListWithLastMessage,
};
