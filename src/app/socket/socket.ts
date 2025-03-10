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
      users.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on(
      "sendMessage",
      (data: { senderId: string; receiverId: string; message: string }) => {
        const { senderId, receiverId, message } = data;
        handleSendMessage({ senderId, receiverId, message });

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
