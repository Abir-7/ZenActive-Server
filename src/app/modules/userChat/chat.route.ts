import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { ChatController } from "./chat.controller";

const router = Router();

router.get(
  "/get-user-chat/:friendId",
  auth("USER"),
  ChatController.getChatsBetweenUsers
);
router.post("/chat-with-fitbot/", auth("USER"), ChatController.chatWithFitbot);
router.post("/:friendId", auth("USER"), ChatController.createChat);

export const ChatRouter = router;
