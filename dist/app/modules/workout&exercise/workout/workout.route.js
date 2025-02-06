"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const workout_controller_1 = require("./workout.controller");
const router = (0, express_1.Router)();
router.post("/create-workout", (0, auth_1.default)("ADMIN"), workout_controller_1.WorkoutController.createWorkout);
router.get("/", (0, auth_1.default)("ADMIN", "USER"), workout_controller_1.WorkoutController.getAllWorkouts);
router.get("/:id", (0, auth_1.default)("ADMIN", "USER"), workout_controller_1.WorkoutController.getWorkoutById);
router.delete("/:id", (0, auth_1.default)("ADMIN"), workout_controller_1.WorkoutController.deleteWorkout);
router.patch("/:id", (0, auth_1.default)("ADMIN"), workout_controller_1.WorkoutController.updateWorkout);
exports.WorkoutRoute = router;
