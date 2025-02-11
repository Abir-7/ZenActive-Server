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
  WorkoutController.createExercise
);
router.get("/", auth("ADMIN", "USER"), WorkoutController.getAllExercise); //
router.get("/:id", auth("ADMIN", "USER"), WorkoutController.getExerciseById);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  WorkoutController.updateExercise
);
router.delete("/:id", auth("ADMIN"), WorkoutController.deleteExercise);

export default router;

export const ExerciseRoute = router;
