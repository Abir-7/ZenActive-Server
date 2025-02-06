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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./app/config");
const app_1 = require("./app");
const seedAdmin_1 = __importDefault(require("./app/DB/seedAdmin"));
const node_cron_1 = __importDefault(require("node-cron"));
const userMealPlan_model_1 = __importDefault(require("./app/modules/userMealPlan/userMealPlan.model"));
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Exit process with failure code
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(config_1.config.database.url);
            console.log("MongoDB connected successfully");
            (0, seedAdmin_1.default)();
            // cron job
            node_cron_1.default.schedule("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Deleting completed meal plans at 12 AM...");
                const result = yield userMealPlan_model_1.default.deleteMany();
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
            }));
            // cron job end
            // Start the server
            app_1.server.listen(config_1.config.server.port, config_1.config.server.ip, () => {
                console.log(`Example app listening on port ${config_1.config.server.port} ip:${config_1.config.server.ip}`);
            });
        }
        catch (error) {
            console.error("Error starting the server:", error);
            process.exit(1); // Exit process with failure code
        }
    });
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    if (app_1.server) {
        app_1.server.close(() => {
            console.error("Unhandled Rejection at:", promise, "reason:", reason);
            process.exit(1);
        });
    }
    else {
        process.exit(1); // Exit process with failure code
    }
});
startServer().catch((err) => {
    console.error("Error starting server:", err);
});
