import { Router } from "express";

import { zodGroupSchema, zodUpdateGroupSchema } from "./group.validation";

import { GroupController } from "./group.controller";
import validateRequest from "../../../middleware/validator";
import auth from "../../../middleware/auth/auth";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { parseField } from "../../../middleware/parseDataMiddleware";

const router = Router();

router.get("/", auth("USER"), GroupController.getAllGroup);

router.post(
  "/create-group",
  validateRequest(zodGroupSchema),
  auth("USER"),
  GroupController.createGroup
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
router.get("/:groupId", auth("USER"), GroupController.getSingleGroupData);

export const GroupRoute = router;
