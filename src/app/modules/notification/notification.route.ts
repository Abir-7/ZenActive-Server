import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth/auth";

const router = express.Router();

router.get("/", auth("USER"), NotificationController.getAllNotifications);

export const NotificationRoute = router;
