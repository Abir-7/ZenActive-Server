import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { WorkoutController } from "./workout.controller";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { parseField } from "../../../middleware/parseDataMiddleware";
import validateRequest from "../../../middleware/validator";
import { zodWorkoutSchema } from "./workout.validation";

const router = Router();
router.post(
  "/create-workout",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodWorkoutSchema),
  WorkoutController.createWorkout
);
router.get("/", auth("ADMIN", "USER"), WorkoutController.getAllWorkouts);
router.get(
  "/workout-exercise/:id",
  auth("ADMIN", "USER"),
  WorkoutController.getWorkoutsExerciseById
);
router.get("/:id", auth("ADMIN", "USER"), WorkoutController.getWorkoutById);
router.delete("/:id", auth("ADMIN"), WorkoutController.deleteWorkout);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  WorkoutController.updateWorkout
);
export const WorkoutRoute = router;
