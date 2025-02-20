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

  const chat = new Chat(chatData);
  return await chat.save();
};

const getChatsBetweenUsers = async (userId: string, friendId: string) => {
  const [userChat, userFriendShipStatus] = await Promise.all([
    Chat.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .exec(),

    UserConnection.findOne({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).select("senderId receiverId status"),
  ]);

  return { userChat, userFriendShipStatus };
};

export const ChatService = {
  createChat,
  getChatsBetweenUsers,
};
