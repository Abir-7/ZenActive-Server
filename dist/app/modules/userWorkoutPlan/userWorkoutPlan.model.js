"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userWorkoutPlan_interface_1 = require("./userWorkoutPlan.interface");
const userWorkoutPlanSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Assuming there is a User model to refer to
    },
    workoutPlanId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "WorkoutPlan", // Assuming there is a WorkoutPlan model to refer to
    },
    currentWorkoutIndex: {
        type: Number,
        required: true,
    },
    currentExerciseIndex: {
        type: Number,
        required: true,
    },
    completedExercises: [
        {
            workoutIndex: {
                type: Number,
                required: true,
            },
            exerciseIndex: {
                type: Number,
                required: true,
            },
            completedAt: {
                type: Date,
                required: true,
            },
        },
    ],
    startedAt: {
        type: Date,
        required: true,
    },
    endAt: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: String,
        enum: userWorkoutPlan_interface_1.status,
        required: true,
    },
}, {
    timestamps: true,
});
// Create the model
const UserWorkoutPlan = (0, mongoose_1.model)("UserWorkoutPlan", userWorkoutPlanSchema);
exports.default = UserWorkoutPlan;
