import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { AuthController } from "../../auth/auth.controller";
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
  validateRequest(zodUpdateWorkoutPlanSchema.unwrap()),
  WorkoutPlanController.updateWorkoutPlan
);

router.get(
  "/",
  auth("ADMIN", "USER"),
  WorkoutPlanController.getAllWorkoutsPlan
);

router.get(
  "/:id",
  auth("ADMIN", "USER"),
  WorkoutPlanController.getSingleWorkoutPlan
);

router.delete(
  "/delete/:id",
  auth("ADMIN"),
  WorkoutPlanController.deleteWorkoutPlan
);

export const WorkoutPlanRoute = router;
