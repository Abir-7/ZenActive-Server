"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
router.get("/get-user-chat/:friendId", (0, auth_1.default)("USER"), chat_controller_1.ChatController.getChatsBetweenUsers);
exports.ChatRouter = router;
