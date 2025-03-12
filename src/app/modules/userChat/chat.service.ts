import status from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import Friend from "../userConnection/friendList/friendlist.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";
import UserConnection from "../userConnection/friendList/friendlist.model";
import { getGeminiResponse } from "../../utils/getGeminiResponse";

const createChat = async (chatData: IChat) => {
  const [isSenderExist, isReceiverExist] = await Promise.all([
    User.findOne({ _id: chatData.senderId }),
    User.findOne({ _id: chatData.receiverId }),
  ]);

  if (!isSenderExist?._id || !isReceiverExist?._id) {
    throw new AppError(404, "User not found.");
  }

  const isExist = await Friend.findOne({
    $or: [
      { senderId: chatData?.senderId, receiverId: chatData.receiverId },
      { senderId: chatData.receiverId, receiverId: chatData.senderId },
    ],
    isAccepted: true,
    status: null,
  });
  if (!isExist?.isAccepted) {
    throw new AppError(404, "You are not friends.");
  }

  if (!isExist) {
    throw new AppError(404, "You are not friends.");
  }

  const chat = new Chat({ ...chatData, seenBy: [chatData.senderId] });

  await UserConnection.findOneAndUpdate(
    {
      $or: [
        { senderId: chatData.receiverId, receiverId: chatData.senderId },
        { senderId: chatData.senderId, receiverId: chatData.receiverId },
      ],
    },
    { lastMessage: chatData.message, updatedAt: Date.now() },
    { new: true }
  );

  return await chat.save();
};

const getChatsBetweenUsers = async (
  userId: string,
  friendId: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  const [userChat, total] = await Promise.all([
    Chat.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 }) // Sort by latest messages first
      .skip(skip)
      .limit(limit)
      .populate({
        path: "senderId",
        select: "name email _id image",
      })
      .populate({
        path: "receiverId",
        select: "name email _id image",
      })
      .lean(),

    Chat.countDocuments({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }),
  ]);

  const userFriendShipStatus = await UserConnection.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  })
    .select("senderId receiverId status isAccepted statusChangeBy")
    .populate({
      path: "statusChangeBy",
      select: "name email _id image",
    })
    .populate({
      path: "senderId",
      select: "name email _id image",
    })
    .populate({
      path: "receiverId",
      select: "name email _id image",
    })
    .lean();

  // Update chats where userId is not in seenBy
  await Chat.updateMany(
    {
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
      seenBy: { $ne: userId },
    },
    { $push: { seenBy: userId } }
  );

  // Create meta data
  const meta = {
    limit,
    page,
    total,
    totalPage: Math.ceil(total / limit),
  };

  const formattedCode = {
    userChat,
    userFriendShipStatus: userFriendShipStatus
      ? {
          senderId: userFriendShipStatus?.senderId,
          receiverId: userFriendShipStatus?.receiverId,
          connectionId: userFriendShipStatus?._id,
          isAccepted: userFriendShipStatus?.isAccepted,
          status: userFriendShipStatus?.status,
          statusChangeBy: userFriendShipStatus?.statusChangeBy,
        }
      : null,
    meta,
  };

  return formattedCode;
};

const chatWithFitBot = async (prompt: string): Promise<string> => {
  try {
    const workoutsResponse = await getGeminiResponse(prompt);

    // Extract text if the response is structured
    const responseText =
      typeof workoutsResponse === "string"
        ? workoutsResponse
        : JSON.stringify(workoutsResponse, null, 2); // Convert object to readable text if necessary

    return responseText;
  } catch (error) {
    console.error("Error fetching response from Gemini:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }
};

export const ChatService = {
  createChat,
  getChatsBetweenUsers,
  chatWithFitBot,
};
