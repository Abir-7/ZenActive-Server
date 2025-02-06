import { Router } from "express";
import auth from "../../middleware/auth/auth";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import { parseField } from "../../middleware/parseDataMiddleware";
import validateRequest from "../../middleware/validator";
import {
  zodChallengeSchema,
  zodUpdateChallengeSchema,
} from "./challenge.validation";
import { ChallengeController } from "./challenge.controller";

const router = Router();
router.post(
  "/create-challenge",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodChallengeSchema),
  ChallengeController.createChallenge
);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUpdateChallengeSchema),
  ChallengeController.updateChallenge
);

router.get(
  "/",
  auth("USER", "ADMIN"), // Adjust role if needed
  ChallengeController.getAllChallenges
);
router.get(
  "/:id",
  auth("USER", "ADMIN"), // Adjust role if needed
  ChallengeController.getSingleChallenge
);

router.delete("/:id", auth("ADMIN"), ChallengeController.deleteChallenge);

export const ChallengeRoute = router;
