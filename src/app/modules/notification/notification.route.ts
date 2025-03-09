import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth/auth";

const router = express.Router();
router.get("/", auth("USER"), NotificationController.getAllNotifications);
router.get(
  "/send-notification",
  auth("USER"),
  NotificationController.checkPushNotification
);
router.patch("/:id", auth("USER"), NotificationController.updateNotification);

export const NotificationRoute = router;
