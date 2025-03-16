import { Types } from "mongoose";

import { ChatService } from "../../modules/userChat/chat.service";

import { io } from "../socket";

export const handleSendMessage = (data: {
  senderId: string;
  receiverId: string;
  message: string;
  connectionId: string;
}) => {
  //sender
  // io.emit(`receiver-${data.connectionId}`, {
  //   senderId: data.senderId,
  //   receiverId: data.receiverId,
  //   content: data.message,
  // });
  //receiver

  io.emit(`receiver-${data.connectionId}`, {
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.message,
  });

  if (data.message && data.receiverId && data.senderId) {
    ChatService.createChat({
      senderId: new Types.ObjectId(data.senderId),
      receiverId: new Types.ObjectId(data.receiverId),
      message: data.message,
      seenBy: [new Types.ObjectId(data.senderId)],
    });
  }
};
