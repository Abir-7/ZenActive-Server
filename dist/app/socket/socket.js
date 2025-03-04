"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.setupSocket = exports.users = void 0;
const socket_io_1 = require("socket.io");
const message_1 = require("./userMessage/message");
exports.users = new Map();
let io; // Store io instance globally
const setupSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            console.log("User registered:", userId);
            exports.users.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(exports.users.keys()));
        });
        socket.on("sendMessage", (data) => {
            const { senderId, receiverId, message } = data;
            (0, message_1.handleSendMessage)({ senderId, receiverId, message });
            // Emit message to receiver if online
            const receiverSocketId = exports.users.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
            }
        });
        socket.on("disconnect", () => {
            var _a;
            const userId = (_a = [...exports.users.entries()].find(([_, id]) => id === socket.id)) === null || _a === void 0 ? void 0 : _a[0];
            if (userId) {
                exports.users.delete(userId);
                io.emit("onlineUsers", Array.from(exports.users.keys()));
            }
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
