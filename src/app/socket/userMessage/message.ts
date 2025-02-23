import { Types } from "mongoose";

import { ChatService } from "../../modules/userChat/chat.service";

import { io, users } from "../socket";

export const handleSendMessage = (data: {
  senderId: string;
  receiverId: string;
  message: string;
}) => {
  //sender
  io.emit(`receiver-${data.senderId}`, {
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.message,
  });
  //receiver
  io.emit(`receiver-${data.receiverId}`, {
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.message,
  });

  if (data.message && data.receiverId && data.senderId) {
    ChatService.createChat({
      senderId: new Types.ObjectId(data.senderId),
      receiverId: new Types.ObjectId(data.receiverId),
      message: data.message,
    });
  }
};
