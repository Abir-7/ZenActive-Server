import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { AppDataController } from "./appdata.controller";

const router = Router();
router.get("/leaderboard", auth("USER"), AppDataController.getLeaderboard);

router.post("/add-point", auth("USER"), AppDataController.addPoints);
router.post(
  "/add-workout-time",
  auth("USER"),
  AppDataController.addWorkoutTime
);

export const AppDataRoute = router;
