"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlanRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const fileUploadHandler_1 = __importDefault(require("../../../middleware/fileUploadHandler"));
const workoutPlan_controller_1 = require("./workoutPlan.controller");
const parseDataMiddleware_1 = require("../../../middleware/parseDataMiddleware");
const validator_1 = __importDefault(require("../../../middleware/validator"));
const workoutPlan_validation_1 = require("./workoutPlan.validation");
const router = (0, express_1.Router)();
router.post("/create-workout-plan", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(workoutPlan_validation_1.zodWorkoutPlanSchema), workoutPlan_controller_1.WorkoutPlanController.createWorkoutPlan);
router.patch("/:id", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(workoutPlan_validation_1.zodUpdateWorkoutPlanSchema), workoutPlan_controller_1.WorkoutPlanController.updateWorkoutPlan);
router.get("/", (0, auth_1.default)("ADMIN", "USER"), workoutPlan_controller_1.WorkoutPlanController.getAllWorkoutsPlan);
router.get("/default/:id", (0, auth_1.default)("ADMIN", "USER"), workoutPlan_controller_1.WorkoutPlanController.getSingleWorkoutPlanDefault // get workout detail..if user it will give workout plan data or user workout plan data
);
router.get("/:id", (0, auth_1.default)("ADMIN", "USER"), workoutPlan_controller_1.WorkoutPlanController.getSingleWorkoutPlan // get workout detail..if user it will give workout plan data or user workout plan data
);
router.delete("/delete/:id", (0, auth_1.default)("ADMIN"), workoutPlan_controller_1.WorkoutPlanController.deleteWorkoutPlan);
exports.WorkoutPlanRoute = router;
