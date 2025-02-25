import { Router } from "express";

import { UserGroupController } from "./userGroup.controller";
import auth from "../../../middleware/auth/auth";

const router = Router();

router.get(
  "/all-user-group",
  auth("USER"),
  UserGroupController.getUserAllGroups
);
router.get(
  "/invite-user-list/:groupId",
  auth("USER"),
  UserGroupController.inviteUserList
);
router.patch(
  "/join/:groupId",
  auth("USER"),
  UserGroupController.addUserToGroup
);
router.patch(
  "/:groupId/remove/:userId",
  auth("USER"),
  UserGroupController.removeUserFromGroup
);
router.patch(
  "/leave/:groupId",
  auth("USER"),
  UserGroupController.leaveFromGroup
);
export const UserGroupRoute = router;
