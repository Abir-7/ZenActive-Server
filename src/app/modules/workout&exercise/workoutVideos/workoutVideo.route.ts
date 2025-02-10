import express from "express";
import { WorkoutVideoController } from "./workoutVideo.controller";
import auth from "../../../middleware/auth/auth";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { parseField } from "../../../middleware/parseDataMiddleware";

const router = express.Router();

router.get(
  "/",
  auth("ADMIN", "USER"),
  WorkoutVideoController.getAllWorkoutVideos
);
router.post(
  "/",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
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
