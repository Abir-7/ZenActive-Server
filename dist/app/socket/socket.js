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
            origin: ["*", "http://localhost:3000"],
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            exports.users.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(exports.users.keys()));
        });
        socket.on("sendMessage", (data) => {
            const { senderId, receiverId, message } = data;
            senderId;
            (0, message_1.handleSendMessage)({ senderId, receiverId, message });
        });
        socket.on("disconnect", () => {
            exports.users.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    exports.users.delete(userId);
                }
            });
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
