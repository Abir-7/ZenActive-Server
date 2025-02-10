import express from "express";
import { DailyExerciseController } from "./dailyExercise.controller";
import auth from "../../middleware/auth/auth";

const router = express.Router();

router.post("/", auth("USER"), DailyExerciseController.createDailyExercise);
router.get("/:id", auth("USER"), DailyExerciseController.getDailyExerciseById);

export const DailyExerciseRoutes = router;
