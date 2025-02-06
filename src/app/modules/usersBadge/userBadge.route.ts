import { Router } from "express";
import { UserBadgeController } from "./userBadge.controller";
import auth from "../../middleware/auth/auth";

const router = Router();
router.post("/", auth("USER"), UserBadgeController.createOrUpdateUserBadge);
router.get(
  "/get-user-badge",
  auth("USER"),
  UserBadgeController.getUserBadgeById
);

export const UserBadgeRoute = router;
