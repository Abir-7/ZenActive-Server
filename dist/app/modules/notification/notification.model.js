"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notification_interface_1 = require("./notification.interface");
const notificationSchema = new mongoose_1.Schema({
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(notification_interface_1.NotificationType),
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
