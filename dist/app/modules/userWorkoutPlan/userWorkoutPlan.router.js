"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWorkoutPlanRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const userWorkoutPlan_controller_1 = require("./userWorkoutPlan.controller");
const validator_1 = __importDefault(require("../../middleware/validator"));
const userWorkoutPlan_validate_1 = require("./userWorkoutPlan.validate");
const router = (0, express_1.Router)();
router.post("/create-user-workout-plan", (0, auth_1.default)("USER"), (0, validator_1.default)(userWorkoutPlan_validate_1.zodStartWorkoutPlanSchema), userWorkoutPlan_controller_1.UserWorkoutPlanController.startWorkoutPlan);
router.get("/get-user-workout-plan/:planId", (0, auth_1.default)("USER"), userWorkoutPlan_controller_1.UserWorkoutPlanController.getActiveWorkoutPlan);
router.patch("/update-user-workout-plan/:planId", (0, auth_1.default)("USER"), userWorkoutPlan_controller_1.UserWorkoutPlanController.updatePresentWorkout);
exports.UserWorkoutPlanRoute = router;
