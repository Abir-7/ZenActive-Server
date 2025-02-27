import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { UserWorkoutPlanController } from "./userWorkoutPlan.controller";
import validateRequest from "../../middleware/validator";
import { zodStartWorkoutPlanSchema } from "./userWorkoutPlan.validate";

const router = Router();
router.post(
  "/create-user-workout-plan",
  auth("USER"),
  validateRequest(zodStartWorkoutPlanSchema),
  UserWorkoutPlanController.startWorkoutPlan
);
router.get(
  "/get-user-workout-plan/:planId",
  auth("USER"),
  UserWorkoutPlanController.getActiveWorkoutPlan
);
router.patch(
  "/update-user-workout-plan/:planId",
  auth("USER"),
  UserWorkoutPlanController.updatePresentWorkout
);
export const UserWorkoutPlanRoute = router;
