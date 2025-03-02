"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
// const createNotification = async (data: Partial<INotification>) => {
//   const notification = await Notification.create(data);
//   return notification;
// };
const getAllNotifications = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    // Step 1: Count total notifications for pagination
    const total = yield notification_model_1.Notification.countDocuments({
        receiverId: userId,
    });
    const totalPage = Math.ceil(total / limit);
    // Step 2: Fetch notifications with pagination
    const notifications = yield notification_model_1.Notification.find({
        receiverId: userId,
    })
        .populate({
        path: "senderId",
        select: "name _id email image",
    })
        .populate({
        path: "receiverId",
        select: "name _id email image",
    })
        .populate("groupId")
        .sort({ createdAt: -1 }) // Sort by latest notifications
        .skip(skip) // Apply pagination
        .limit(limit) // Limit results per page
        .lean();
    return {
        meta: { limit, page, total, totalPage },
        data: notifications,
    };
});
const updateNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.findByIdAndUpdate(id, { isRead: true }, {
        new: true,
    });
    return notification;
});
exports.NotificationService = {
    getAllNotifications,
    updateNotification,
};
