"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAppData = void 0;
const mongoose_1 = require("mongoose");
const userAppDataSchema = new mongoose_1.Schema({
    tdee: { type: Number, required: false, default: 0 },
    workoutTime: { type: Number, required: false, default: 0 },
    completedWorkoutTime: { type: Number, required: false, default: 0 },
    points: { type: Number, required: false, default: 0 },
    gainedCalories: { type: Number, required: false, default: 0 },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
exports.UserAppData = (0, mongoose_1.model)("UserAppData", userAppDataSchema);
