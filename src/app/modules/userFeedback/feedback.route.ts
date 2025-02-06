import { Router } from "express";
import { FeedbackController } from "./feedback.controller";
import auth from "../../middleware/auth/auth";

const router = Router();

// User Workout Plan Feedback routes
router.post("/add", auth("USER"), FeedbackController.giveWorkoutPlanFeedback);
router.get(
  "/all-workout-plan",
  auth("ADMIN"),
  FeedbackController.getAllWorkoutPlanWithFeedback
);

export const FeedbackRoute = router;
