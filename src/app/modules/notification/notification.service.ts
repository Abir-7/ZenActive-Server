import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";

// const createNotification = async (data: Partial<INotification>) => {
//   const notification = await Notification.create(data);
//   return notification;
// };

const getAllNotifications = async (userId: string) => {
  console.log(userId);
  const notifications = await Notification.find({ receiverId: userId })
    .sort({ createdAt: -1 })
    .lean();
  return notifications;
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
