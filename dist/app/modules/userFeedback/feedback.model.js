"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserWorkoutPlanFeedbackSchema = new mongoose_1.Schema({
    planId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    isAllExcerciseComplete: { type: Boolean, required: true },
    challengesFace: { type: String, required: true },
}, {
    timestamps: true,
});
const UserWorkoutPlanFeedback = (0, mongoose_1.model)("UserWorkoutPlanFeedback", UserWorkoutPlanFeedbackSchema);
exports.default = UserWorkoutPlanFeedback;
