import { Request, Response } from "express";

import httpStatus from "http-status";
import { ChatService } from "./chat.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { Types } from "mongoose";

// Create a new chat message
const createChat = catchAsync(async (req: Request, res: Response) => {
  const { friendId } = req.params;
  const receiverId = new Types.ObjectId(friendId);
  const { userId: senderId } = req.user;

  const { message } = req.body;

  const result = await ChatService.createChat({
    senderId,
    receiverId,
    message,
    seenBy: [],
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Chat message created successfully.",
  });
});

// Get all chat messages between two users
const getChatsBetweenUsers = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { friendId } = req.params;
  const { page, limit } = req.query;
  const result = await ChatService.getChatsBetweenUsers(
    userId,
    friendId,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: {
      userChat: result.userChat,
      userFriendShipStatus: result.userFriendShipStatus,
    },
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Chat messages fetched successfully.",
  });
});

// Group all controller functions into an object
export const ChatController = {
  createChat,
  getChatsBetweenUsers,
};
