import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { WorkoutController } from "./workout.controller";

const router = Router();
router.post("/create-workout", auth("ADMIN"), WorkoutController.createWorkout);
router.get("/", auth("ADMIN", "USER"), WorkoutController.getAllWorkouts);
router.get("/:id", auth("ADMIN", "USER"), WorkoutController.getWorkoutById);
router.delete("/:id", auth("ADMIN"), WorkoutController.deleteWorkout);
router.patch("/:id", auth("ADMIN"), WorkoutController.updateWorkout);
export const WorkoutRoute = router;
