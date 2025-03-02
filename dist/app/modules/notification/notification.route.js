"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoute = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("USER"), notification_controller_1.NotificationController.getAllNotifications);
router.patch("/:id", (0, auth_1.default)("USER"), notification_controller_1.NotificationController.updateNotification);
exports.NotificationRoute = router;
