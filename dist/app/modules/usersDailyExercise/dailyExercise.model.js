"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DailyExerciseSchema = new mongoose_1.Schema({
    exerciseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Workout",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    completedDate: { type: Date, required: true },
}, {
    timestamps: true,
});
const DailyExercise = (0, mongoose_1.model)("DailyExercise", DailyExerciseSchema);
exports.default = DailyExercise;
