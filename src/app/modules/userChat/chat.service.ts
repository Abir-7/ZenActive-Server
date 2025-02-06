import AppError from "../../errors/AppError";
import Friend from "../userConnection/friendList/friendlist.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";

const createChat = async (chatData: IChat) => {
  console.log(chatData?.senderId, chatData.receiverId);
  const isExist = await Friend.findOne({
    $or: [
      { senderId: chatData?.senderId, receiverId: chatData.receiverId },
      { senderId: chatData.receiverId, receiverId: chatData.senderId },
    ],
  });
  console.log(isExist);
  if (!isExist) {
    throw new AppError(404, "You are not friends.");
  }

  const chat = new Chat(chatData);
  return await chat.save();
};

const getChatsBetweenUsers = async (
  senderId: string,
  receiverId: string
): Promise<IChat[]> => {
  return await Chat.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  })
    .sort({ createdAt: 1 })
    .exec();
};

export const ChatService = {
  createChat,
  getChatsBetweenUsers,
};
