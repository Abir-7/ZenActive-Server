"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendMessage = void 0;
const mongoose_1 = require("mongoose");
const chat_service_1 = require("../../modules/userChat/chat.service");
const socket_1 = require("../socket");
const handleSendMessage = (data) => {
    //sender
    // io.emit(`receiver-${data.connectionId}`, {
    //   senderId: data.senderId,
    //   receiverId: data.receiverId,
    //   content: data.message,
    // });
    //receiver
    socket_1.io.emit(`receiver-${data.connectionId}`, {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.message,
    });
    if (data.message && data.receiverId && data.senderId) {
        chat_service_1.ChatService.createChat({
            senderId: new mongoose_1.Types.ObjectId(data.senderId),
            receiverId: new mongoose_1.Types.ObjectId(data.receiverId),
            message: data.message,
            seenBy: [new mongoose_1.Types.ObjectId(data.senderId)],
        });
    }
};
exports.handleSendMessage = handleSendMessage;
