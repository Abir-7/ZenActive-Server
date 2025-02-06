import mongoose from "mongoose";
import { config } from "./app/config";
import { server } from "./app";
import seedAdmin from "./app/DB/seedAdmin";
import cron from "node-cron";
import UserMealPlan from "./app/modules/userMealPlan/userMealPlan.model";
import admin from "./app/firebase/firebase";
// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Exit process with failure code
});

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.url as string);
    console.log("MongoDB connected successfully");
    seedAdmin();

    // cron job
    cron.schedule("0 0 * * *", async () => {
      console.log("Deleting completed meal plans at 12 AM...");
      const result = await UserMealPlan.deleteMany();
      console.log(`Deleted ${result.deletedCount}  meal plans.`);
      // {
      //   const message = {
      //     token:
      //       "eZ0OZnAZSJaJbNaJb8cMhX:APA91bEj2zajj__PCCw-J5A8pUW52LkhEIeke3of5OybdJ9PJPYqKFZy5oQ21Ng1VW1FoO-cggY6hiVGurdcQG9VKiFfpcXN4mv8nwabjEBYvytQ0hrdmqY", // Device FCM Token
      //     notification: {
      //       title: "From node cron",
      //       body: "This is your notification message.",
      //     },
      //     data: {
      //       extraData: "Custom Data",
      //     },
      //   };
      //   const response = await admin.messaging().send(message);
      // }
    });
    // cron job end

    // Start the server
    server.listen(config.server.port, config.server.ip as string, () => {
      console.log(
        `Example app listening on port ${config.server.port} ip:${config.server.ip}`
      );
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit process with failure code
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  if (server) {
    server.close(() => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });
  } else {
    process.exit(1); // Exit process with failure code
  }
});

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
