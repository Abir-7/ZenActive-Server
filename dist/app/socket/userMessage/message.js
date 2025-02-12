"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendMessage = void 0;
const socket_1 = require("../socket");
const handleSendMessage = (data) => {
    const receiverSocketId = socket_1.users.get(data.receiverId);
    if (receiverSocketId) {
        socket_1.io.to(receiverSocketId).emit("receiveMessage", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.message,
        });
    }
};
exports.handleSendMessage = handleSendMessage;
