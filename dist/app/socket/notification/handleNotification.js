"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotification = void 0;
const socket_1 = require("../socket");
const handleNotification = (message, receiverId) => {
    socket_1.io.emit(`notification-${receiverId}`, {
        message,
    });
};
exports.handleNotification = handleNotification;
