import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import Friend from "../userConnection/friendList/friendlist.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";

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
  });

  if (!isExist) {
    throw new AppError(404, "You are not friends.");
  }

  const chat = new Chat(chatData);
  return await chat.save();
};

const getChatsBetweenUsers = async (userId: string, friendId: string) => {
  return await Chat.find({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .exec();
};

export const ChatService = {
  createChat,
  getChatsBetweenUsers,
};
