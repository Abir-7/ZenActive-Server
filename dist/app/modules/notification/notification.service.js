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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.sendPushNotification = void 0;
const firebase_1 = __importDefault(require("../../firebase/firebase"));
const user_model_1 = require("../user/user.model");
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
const sendPushNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Sending push notifications...");
        const users = yield user_model_1.User.find({
            $and: [
                { fcmToken: { $exists: true } },
                { fcmToken: { $ne: null } },
                { fcmToken: { $ne: "" } },
            ],
        })
            .select("email fcmToken")
            .lean(); // Fetch only required fields
        if (users.length === 0)
            return console.log("No users with valid fcmToken");
        const messages = users.map((user) => ({
            token: user.fcmToken,
            notification: { title: data.title, body: data.body },
        }));
        const BATCH_SIZE = 500; // Firebase batch limit
        for (let i = 0; i < messages.length; i += BATCH_SIZE) {
            const batch = messages.slice(i, i + BATCH_SIZE);
            const responses = yield Promise.allSettled(batch.map((msg) => firebase_1.default.messaging().send(msg)));
            responses.forEach((result, index) => {
                const user = users[i + index];
                if (result.status === "fulfilled") {
                    console.log(`Notification sent to ${user.email}`);
                }
                else {
                    console.error(`Failed to send notification to ${user.email}`);
                }
            });
        }
    }
    catch (err) {
        console.error("Notification Error:", err.message);
    }
});
exports.sendPushNotification = sendPushNotification;
exports.NotificationService = {
    getAllNotifications,
    updateNotification,
    sendPushNotification: exports.sendPushNotification,
};
