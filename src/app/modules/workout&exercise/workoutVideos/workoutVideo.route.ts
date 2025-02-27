import express from "express";
import { WorkoutVideoController } from "./workoutVideo.controller";
import auth from "../../../middleware/auth/auth";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { parseField } from "../../../middleware/parseDataMiddleware";
import validateRequest from "../../../middleware/validator";
import { zodWorkoutVideoSchema } from "./workoutVideo.validation";

const router = express.Router();

router.get(
  "/",
  auth("ADMIN", "USER"),
  WorkoutVideoController.getAllWorkoutVideos
);
router.get(
  "/:id",
  auth("ADMIN", "USER"),
  WorkoutVideoController.getSingleWorkoutVideos
);
router.post(
  "/",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodWorkoutVideoSchema),
  WorkoutVideoController.createWorkoutVideo
);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  WorkoutVideoController.updateWorkoutVideo
);
router.delete("/:id", auth("ADMIN"), WorkoutVideoController.deleteWorkoutVideo);

export const WorkoutVideoRoutes = router;
