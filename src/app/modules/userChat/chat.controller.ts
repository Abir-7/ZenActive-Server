import { Request, Response } from "express";

import httpStatus from "http-status";
import { ChatService } from "./chat.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create a new chat message
const createChat = catchAsync(async (req: Request, res: Response) => {
  const { senderId, receiverId, message } = req.body;
  const result = await ChatService.createChat({
    senderId,
    receiverId,
    message,
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
  const result = await ChatService.getChatsBetweenUsers(userId, friendId);
  sendResponse(res, {
    data: result,
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
