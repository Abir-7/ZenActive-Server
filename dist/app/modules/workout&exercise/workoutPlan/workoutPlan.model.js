"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlan = void 0;
// models/workout.model.ts
const mongoose_1 = require("mongoose");
const WorkoutPlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    workouts: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Workout" }],
    points: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, required: true },
}, { timestamps: true });
exports.WorkoutPlan = (0, mongoose_1.model)("WorkoutPlan", WorkoutPlanSchema);
