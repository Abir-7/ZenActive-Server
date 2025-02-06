"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoute = void 0;
const express_1 = require("express");
const feedback_controller_1 = require("./feedback.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const router = (0, express_1.Router)();
// User Workout Plan Feedback routes
router.post("/add", (0, auth_1.default)("USER"), feedback_controller_1.FeedbackController.giveWorkoutPlanFeedback);
router.get("/all-workout-plan", (0, auth_1.default)("ADMIN"), feedback_controller_1.FeedbackController.getAllWorkoutPlanWithFeedback);
exports.FeedbackRoute = router;
