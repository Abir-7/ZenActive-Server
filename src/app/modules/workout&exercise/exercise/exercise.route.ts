import { Router } from "express";
import { WorkoutController } from "./exercise.controller";
import { parseField } from "../../../middleware/parseDataMiddleware";
import auth from "../../../middleware/auth/auth";
import validateRequest from "../../../middleware/validator";

import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { zodExerciseSchema } from "./exercise.validation";

const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodExerciseSchema),
  WorkoutController.createWorkout
);
router.get("/", auth("ADMIN", "USER"), WorkoutController.getAllWorkouts); //
router.get("/:id", auth("ADMIN", "USER"), WorkoutController.getWorkoutById);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  WorkoutController.updateWorkout
);
router.delete("/:id", auth("ADMIN"), WorkoutController.deleteWorkout);

export default router;

export const ExerciseRoute = router;
