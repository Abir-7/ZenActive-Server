"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.setupSocket = exports.users = void 0;
const socket_io_1 = require("socket.io");
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
        console.log("User connected:", socket.id);
        socket.on("register", (userId) => {
            exports.users.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            io.emit("onlineUsers", Array.from(exports.users.keys()));
        });
        socket.on("disconnect", () => {
            exports.users.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    exports.users.delete(userId);
                    console.log(`User ${userId} disconnected`);
                }
            });
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
