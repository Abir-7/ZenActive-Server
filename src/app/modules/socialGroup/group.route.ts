import { Router } from "express";
import validateRequest from "../../middleware/validator";
import { zodGroupSchema, zodUpdateGroupSchema } from "./group.validation";
import auth from "../../middleware/auth/auth";
import { GroupController } from "./group.controller";
import { parseField } from "../../middleware/parseDataMiddleware";
import fileUploadHandler from "../../middleware/fileUploadHandler";

const router = Router();

router.get("/", auth("USER"), GroupController.getUserAllGroups);
router.get("/:groupId", auth("USER"), GroupController.getSingleGroupData);

router.post(
  "/create-group",
  validateRequest(zodGroupSchema),
  auth("USER"),
  GroupController.createGroup
);
router.patch("/join/:groupId", auth("USER"), GroupController.addUserToGroup);
router.patch("/leave/:groupId", auth("USER"), GroupController.leaveFromGroup);
router.patch(
  "/:groupId/remove/:userId",
  auth("USER"),
  GroupController.removeUserFromGroup
);

router.patch(
  "/:groupId",
  auth("USER"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUpdateGroupSchema),

  GroupController.updateGroup
);

router.delete("/:groupId", auth("USER"), GroupController.deleteGroup);

export const GroupRoute = router;
