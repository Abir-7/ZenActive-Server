import mongoose from "mongoose";
import { config } from "./app/config";
import { server } from "./app";
import seedAdmin from "./app/DB/seedAdmin";

import { setupCronJobs } from "./app/node-cron/cronJobs";
import { setupSocket } from "./app/socket/socket";
import { seedSubscription } from "./app/DB/seedSubscription";

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Exit process with failure code
});

async function startServer(retries = 5) {
  while (retries > 0) {
    try {
      // Connect to MongoDB
      await mongoose.connect(config.database.url as string);
      console.log("MongoDB connected successfully");
      await seedAdmin();
      await seedSubscription();
      setupCronJobs();
      setupSocket(server);

      server.listen(
        config.server.port,
        // config.server.ip as string,
        () => {
          console.log(
            `Example app listening on port ${config.server.port} ip:${config.server.ip}`,
          );
        },
      );
      break; // Exit loop on success
    } catch (error) {
      retries -= 1;
      console.error(
        `Error starting the server (Retries left: ${retries}):`,
        error,
      );
      if (retries === 0) {
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
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
