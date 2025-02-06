import { Router } from "express";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import { BadgeController } from "./badge.controller";
import { parseField } from "../../middleware/parseDataMiddleware";
import auth from "../../middleware/auth/auth";
import validateRequest from "../../middleware/validator";
import { zodBadgeSchema, zodUpdateBadgeSchema } from "./badge.validation";

const router = Router();

router.post(
  "/create-badge",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodBadgeSchema),
  BadgeController.createBadge
);

router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUpdateBadgeSchema),
  BadgeController.editBadge
);
router.get("/", auth("ADMIN", "USER"), BadgeController.getAllBadge);
router.get("/:id", BadgeController.getSingleBadge);

router.delete("/:id", auth("ADMIN", "USER"), BadgeController.deleteBadge);

export const BadgeRoute = router;
