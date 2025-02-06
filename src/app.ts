import express from "express";
import cors from "cors";
import cookePerser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import noRouteError from "./app/middleware/noRoute";
import router from "./app/routes";
import http from "http";
import { Server } from "socket.io";
import { Chat } from "./app/modules/userChat/chat.model";
import { ChatService } from "./app/modules/userChat/chat.service";
import { IChat } from "./app/modules/userChat/chat.interface";

const corsOption = {
  origin: ["http://localhost:3000", "*"],
  credentials: true,
  methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));
app.use(cookePerser());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", router);

app.use(globalErrorHandler);
app.use(noRouteError);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["*", "http://localhost:3000"], // Allow all origins
    methods: ["GET", "POST"],
  },
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("register", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", async (data: IChat) => {
    const receiverSocketId = users.get(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.message,
      });
    }

    await ChatService.createChat(data);
  });

  socket.on("disconnect", () => {
    // Remove user from the mapping when they disconnect
    users.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

export { app, server };
