import express from "express";
import { FriendListController } from "./friendlist.controller";
import auth from "../../../middleware/auth/auth";
import validateRequest from "../../../middleware/validator";
import { zodFriendListSchema } from "./friendlist.validation";

const router = express.Router();

router.post(
  "/send-request",
  validateRequest(zodFriendListSchema),
  auth("USER"),
  FriendListController.addFriend
);

router.patch(
  "/accept-request",
  auth("USER"),
  FriendListController.acceteptRequest
);

router.patch(
  "/unfriend",
  validateRequest(zodFriendListSchema),
  auth("USER"),
  FriendListController.removeFriend
);
router.patch(
  "/remove",
  validateRequest(zodFriendListSchema),
  auth("USER"),
  FriendListController.removeFriend
);
router.patch(
  "/remove-request",
  validateRequest(zodFriendListSchema),
  auth("USER"),
  FriendListController.removeRequest
);
router.patch(
  "/block",
  validateRequest(zodFriendListSchema),
  auth("USER"),
  FriendListController.addToBlock
);
router.get(
  "/with-last-message",
  auth("USER"),
  FriendListController.getFriendListWithLastMessage
);

router.get("/", auth("USER"), FriendListController.getFriendList);
router.get("/pending", auth("USER"), FriendListController.getPendingList);

router.get("/suggested", auth("USER"), FriendListController.getSugestedFriend);

export const FriendListRoute = router;
