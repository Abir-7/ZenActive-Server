import AppError from "../../errors/AppError";
import admin from "../../firebase/firebase";
import { User } from "../user/user.model";

import { Notification } from "./notification.model";

// const createNotification = async (data: Partial<INotification>) => {
//   const notification = await Notification.create(data);
//   return notification;
// };

const getAllNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  // Step 1: Count total notifications for pagination
  const total = await Notification.countDocuments({
    receiverId: userId,
  });
  const totalPage = Math.ceil(total / limit);

  // Step 2: Fetch notifications with pagination
  const notifications = await Notification.find({
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
};

const updateNotification = async (id: string) => {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    {
      new: true,
    }
  );
  return notification;
};

export const sendPushNotification = async (data: {
  title: string;
  body: string;
}) => {
  try {
    console.log("Sending push notifications...");

    const users = await User.find({
      $and: [
        { fcmToken: { $exists: true } },
        { fcmToken: { $ne: null } },
        { fcmToken: { $ne: "" } },
      ],
    })
      .select("email fcmToken")
      .lean(); // Fetch only required fields

    if (users.length === 0) return console.log("No users with valid fcmToken");

    const messages = users.map((user) => ({
      token: user.fcmToken,
      notification: { title: data.title, body: data.body },
    }));

    const BATCH_SIZE = 500; // Firebase batch limit
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const responses = await Promise.allSettled(
        batch.map((msg) => admin.messaging().send(msg))
      );

      responses.forEach((result, index) => {
        const user = users[i + index];
        if (result.status === "fulfilled") {
          console.log(`Notification sent to ${user.email}`);
        } else {
          console.error(`Failed to send notification to ${user.email}`);
        }
      });
    }
  } catch (err: any) {
    console.error("Notification Error:", err.message);
  }
};

export const NotificationService = {
  getAllNotifications,
  updateNotification,
  sendPushNotification,
};
