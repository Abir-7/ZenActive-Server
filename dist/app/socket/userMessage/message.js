"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendMessage = void 0;
const mongoose_1 = require("mongoose");
const chat_service_1 = require("../../modules/userChat/chat.service");
const socket_1 = require("../socket");
const handleSendMessage = (data) => {
    const receiverSocketId = socket_1.users.get(data.receiverId);
    if (receiverSocketId) {
        socket_1.io.emit(`receiver-${data.receiverId}`, {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.message,
        });
    }
    if (data.message && data.receiverId && data.senderId) {
        chat_service_1.ChatService.createChat({
            senderId: new mongoose_1.Types.ObjectId(data.senderId),
            receiverId: new mongoose_1.Types.ObjectId(data.receiverId),
            message: data.message,
        });
    }
};
exports.handleSendMessage = handleSendMessage;
