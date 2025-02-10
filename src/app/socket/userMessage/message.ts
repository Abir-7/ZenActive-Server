import { IChat } from "../../modules/userChat/chat.interface";

import { io, users } from "../socket";

export const handleSendMessage = (data: IChat) => {
  const receiverSocketId = users.get(data.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", {
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.message,
    });
  }
};
