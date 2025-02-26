import { INotification } from "./notification.interface";
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
  const total = await Notification.countDocuments({ receiverId: userId });
  const totalPage = Math.ceil(total / limit);

  // Step 2: Fetch notifications with pagination
  const notifications = await Notification.find({ receiverId: userId })
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

// const updateNotification = async (
//   id: string,
//   updateData: Partial<INotification>
// ) => {
//   const notification = await Notification.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
//   return notification;
// };

export const NotificationService = {
  getAllNotifications,
};
