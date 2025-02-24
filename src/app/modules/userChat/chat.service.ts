import status from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import Friend from "../userConnection/friendList/friendlist.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";
import UserConnection from "../userConnection/friendList/friendlist.model";

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

  if (!isExist) {
    throw new AppError(404, "You are not friends.");
  }

  const chat = new Chat({ ...chatData, seenBy: [chatData.senderId] });
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
      .sort({ createdAt: -1 }) // Sort by latest messages first
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
    });

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

  return { userChat, userFriendShipStatus, meta };
};
export const ChatService = {
  createChat,
  getChatsBetweenUsers,
};
