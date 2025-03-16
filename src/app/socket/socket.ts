import { Server } from "socket.io";
import { handleSendMessage } from "./userMessage/message";

export const users = new Map<string, string>();
let io: Server; // Store io instance globally

const setupSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId: string) => {
      console.log("User registered:", userId);
      if (!!userId) {
        users.forEach((socketId, existingUserId) => {
          if (existingUserId === userId) {
            users.delete(existingUserId);
          }
        });
        users.set(userId, socket.id);
      }
      console.log(Array.from(users.keys()), "users");
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on(
      "sendMessage",
      (data: {
        senderId: string;
        receiverId: string;
        message: string;
        connectionId: string;
      }) => {
        const { senderId, receiverId, message, connectionId } = data;
        handleSendMessage({ senderId, receiverId, message, connectionId });

        // Emit message to receiver if online
        // const receiverSocketId = users.get(receiverId);
        // if (receiverSocketId) {
        //   io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        // }
      }
    );

    socket.on("disconnect", () => {
      const userId = [...users.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];
      if (userId) {
        users.delete(userId);
        io.emit("onlineUsers", Array.from(users.keys()));
      }
    });
  });

  return io;
};

export { setupSocket, io };
