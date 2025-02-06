import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { ChatController } from "./chat.controller";

const router = Router();

router.get(
  "/get-user-chat/:friendId",
  auth("USER"),
  ChatController.getChatsBetweenUsers
);

export const ChatRouter = router;
