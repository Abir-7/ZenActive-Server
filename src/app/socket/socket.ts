import { Server } from "socket.io";
import { ChatService } from "../modules/userChat/chat.service";
import { IChat } from "../modules/userChat/chat.interface";

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
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);

      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on("disconnect", () => {
      users.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          users.delete(userId);
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  });

  return io;
};

export { setupSocket, io };
