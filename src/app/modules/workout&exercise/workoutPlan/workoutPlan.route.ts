import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import fileUploadHandler from "../../../middleware/fileUploadHandler";

import { WorkoutPlanController } from "./workoutPlan.controller";
import { parseField } from "../../../middleware/parseDataMiddleware";
import validateRequest from "../../../middleware/validator";
import {
  zodUpdateWorkoutPlanSchema,
  zodWorkoutPlanSchema,
} from "./workoutPlan.validation";

const router = Router();
router.post(
  "/create-workout-plan",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodWorkoutPlanSchema),
  WorkoutPlanController.createWorkoutPlan
);

router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUpdateWorkoutPlanSchema),
  WorkoutPlanController.updateWorkoutPlan
);

router.get(
  "/",
  auth("ADMIN", "USER"),
  WorkoutPlanController.getAllWorkoutsPlan
);

router.get(
  "/default/:id",
  auth("ADMIN", "USER"),
  WorkoutPlanController.getSingleWorkoutPlanDefault // get workout detail..if user it will give workout plan data or user workout plan data
);

router.get(
  "/:id",
  auth("ADMIN", "USER"),
  WorkoutPlanController.getSingleWorkoutPlan // get workout detail..if user it will give workout plan data or user workout plan data
);

router.delete(
  "/delete/:id",
  auth("ADMIN"),
  WorkoutPlanController.deleteWorkoutPlan
);

export const WorkoutPlanRoute = router;
