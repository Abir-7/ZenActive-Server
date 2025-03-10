import AppError from "../../errors/AppError";
import admin from "../../firebase/firebase";
import UserWorkoutPlan from "../userWorkoutPlan/userWorkoutPlan.model";
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

const checkPushNotification = async () => {
  try {
    // Define the notification payload
    const payload = {
      notification: {
        title: "Workout Reminder!",
        body: "You missed your workout today. Let’s get moving!",
      },
    };

    const today = new Date();

    // Aggregate to get users who haven't completed their workout today
    const users = await UserWorkoutPlan.aggregate([
      // 1. Extract the last completed exercise
      {
        $addFields: {
          lastCompleted: { $arrayElemAt: ["$completedExercises", -1] },
        },
      },
      // 2. Check if the last completed exercise was done today
      {
        $addFields: {
          isDoneToday: {
            $cond: {
              if: {
                $eq: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$lastCompleted.completedAt",
                    },
                  },
                  { $dateToString: { format: "%Y-%m-%d", date: today } },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      // 3. Only include documents where the workout was not done today
      {
        $match: { isDoneToday: false },
      },
      // 4. Join with the users collection to retrieve user details
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // 5. Unwind the resulting array from the lookup
      {
        $unwind: "$user",
      },
      // 6. Project only the user's email and fcmToken as top-level fields
      {
        $project: {
          _id: 0,
          email: "$user.email",
          fcmToken: "$user.fcmToken",
        },
      },
    ]);

    // Loop through each user and send a push notification if they have a valid FCM token
    for (const user of users) {
      if (user.fcmToken) {
        try {
          const response = await admin.messaging().send({
            token: user.fcmToken,
            notification: payload.notification,
          });
          console.log(`Notification sent to ${user.email}:`, response);
        } catch (error: any) {
          console.error(
            `Error sending notification to ${user.email}:`,
            error.message
          );

          throw new AppError(
            500,
            `Error sending notification to ${user.email}: ${error.message}`
          );
        }
      }
    }
  } catch (err: any) {
    console.error("Aggregation error:", err.message);
    throw new AppError(500, `${err.message}`);
  }
};

export const NotificationService = {
  getAllNotifications,
  updateNotification,
  checkPushNotification,
};
