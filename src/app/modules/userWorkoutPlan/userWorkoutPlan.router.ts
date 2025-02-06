import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { UserWorkoutPlanController } from "./userWorkoutPlan.controller";

const router = Router();
router.post(
  "/create-user-workout-plan",
  auth("USER"),
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
