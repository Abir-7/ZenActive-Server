import { Server } from "socket.io";
import { ChatService } from "../modules/userChat/chat.service";
import { IChat } from "../modules/userChat/chat.interface";
import { handleSendMessage } from "./userMessage/message";
import { Types } from "mongoose";

export const users = new Map();
let io: Server; // Store io instance globally
const setupSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ["*", "http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      users.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on(
      "sendMessage",
      (data: { senderId: string; receiverId: string; message: string }) => {
        console.log(
          data,
          "-------------------------------------------------------------------------------------->"
        );
        const { senderId, receiverId, message } = data;
        senderId;
        handleSendMessage({ senderId, receiverId, message });
      }
    );

    socket.on("disconnect", () => {
      users.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          users.delete(userId);
        }
      });
    });
  });

  return io;
};

export { setupSocket, io };
