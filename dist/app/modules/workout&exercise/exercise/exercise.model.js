"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const exerciseSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    restTime: { type: Number, required: true },
    video: { type: String, required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    goal: { type: String, required: true },
    duration: { type: Number, required: true },
    about: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
});
const Exercise = (0, mongoose_1.model)("Exercise", exerciseSchema);
exports.default = Exercise;
