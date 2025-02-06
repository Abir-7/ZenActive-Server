"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    exercises: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "Exercise", required: true },
    ],
}, { timestamps: true });
const Workout = (0, mongoose_1.model)("Workout", workoutSchema);
exports.default = Workout;
