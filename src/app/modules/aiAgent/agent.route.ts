import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { AIAgentController } from "./agent.controller";

const router = Router();

router.post(
  "/generate-workout-plan",
  auth("USER"),
  AIAgentController.generateWorkoutPlan
);

export const AIAgentRoutes = router;
