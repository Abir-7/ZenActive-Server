import cron from "node-cron";
import UserMealPlan from "../modules/userMealPlan/userMealPlan.model";
import DailyExercise from "../modules/usersDailyExercise/dailyExercise.model";
import Exercise from "../modules/workout&exercise/exercise/exercise.model";
import { Types } from "mongoose";
import DailyChallenge from "../modules/usersDailyChallage/usersDailyExercise.model";
import UserWorkoutPlan from "../modules/userWorkoutPlan/userWorkoutPlan.model";
import admin from "../firebase/firebase";
import AppError from "../errors/AppError";
import { User } from "../modules/user/user.model";

import Payment from "../modules/payment/payment/payment.model";

export const setupCronJobs = () => {
  // delete user meal plan at 12Am everyday
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await UserMealPlan.deleteMany();
      console.log(`Deleted ${result.deletedCount} meal plans.`);
    } catch (error) {
      console.error("Error deleting meal plans:", error);
    }
  });

  // delete DailyExercise
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await DailyExercise.deleteMany();
      console.log(`Deleted ${result.deletedCount} DailyExercise.`);
    } catch (error) {
      console.error("Error deleting DailyExercise:", error);
    }
  });

  // add 10 random daily challenge
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await DailyChallenge.deleteMany();
      console.log(`Deleted ${result.deletedCount} Daily Challenges.`);

      // 1️⃣ Fetch all exercises
      const allExercises = await Exercise.find(
        { isPremium: false },
        "_id"
      ).lean();

      if (allExercises.length === 0) {
        console.log("No exercises found!");
        return;
      }

      // 2️⃣ Shuffle & Select 10 Random Exercise IDs
      const shuffledExercises = allExercises
        .map((exercise) => exercise._id)
        .sort(() => 0.5 - Math.random()) // Random shuffle
        .slice(0, 10); // Pick first 10

      // 3️⃣ Create Daily Challenge Entries
      const dailyChallenges = shuffledExercises.map((exerciseId) => ({
        exerciseId: new Types.ObjectId(exerciseId),
      }));

      // 4️⃣ Insert into MongoDB
      await DailyChallenge.insertMany(dailyChallenges);
    } catch (error) {
      console.error("Error creating daily challenges:", error);
    }
  });

  //  send notification allert for user workout plan

  // Schedule the job to run at midnight every day
  cron.schedule("0 18 * * *", async () => {
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
      console.log(users.length);
      // Loop through each user and send a push notification if they have a valid FCM token
      for (const user of users) {
        if (user.fcmToken) {
          console.log(user.fcmToken);
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
  });

  // cron.schedule("0 0 * * *", async () => {
  //   try {
  //     console.log("Running subscription expiry check at 12:00 AM...");

  //     const now = new Date();

  //     // Find all users with premium access
  //     const premiumUsers = await User.find({ hasPremiumAccess: true });

  //     // For each user, check if they have an active (non-expired) subscription.
  //     for (const user of premiumUsers) {
  //       const activeSubscription = await Payment.findOne({
  //         userId: user._id,
  //         expiryDate: { $gte: now }, // Subscription expiry date is in the future
  //       });

  //       // If no active subscription exists, update the user's premium access
  //       if (!activeSubscription) {
  //         await User.findByIdAndUpdate(user._id, { hasPremiumAccess: false });
  //         console.log(
  //           `User ${user._id} subscription expired. Premium access revoked.`
  //         );
  //       }
  //     }

  //     console.log("Subscription expiry check complete.");
  //   } catch (error) {
  //     console.error("Error during subscription expiry check:", error);
  //   }
  // });

  cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription expiry check at 12:00 AM...");
    const now = new Date();

    try {
      // Step 1: Get users with premium access whose subscription may have expired
      const expiredUsers = await User.aggregate([
        {
          $match: {
            hasPremiumAccess: true,
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "userId",
            as: "payments",
          },
        },
        {
          $addFields: {
            activeSubscription: {
              $filter: {
                input: "$payments",
                as: "payment",
                cond: { $gte: ["$$payment.expiryDate", now] },
              },
            },
          },
        },
        {
          $match: {
            activeSubscription: { $size: 0 },
          },
        },
      ]);

      // Step 2: Update all expired users in bulk
      const expiredUserIds = expiredUsers.map((user) => user._id);
      if (expiredUserIds.length) {
        await User.updateMany(
          { _id: { $in: expiredUserIds } },
          { $set: { hasPremiumAccess: false } }
        );
        console.log(
          `${expiredUserIds.length} user(s) had their premium access revoked.`
        );
      } else {
        console.log("No expired subscriptions found.");
      }

      console.log("Subscription expiry check complete.");
    } catch (error) {
      console.error("Error during subscription expiry check:", error);
    }
  });
};
