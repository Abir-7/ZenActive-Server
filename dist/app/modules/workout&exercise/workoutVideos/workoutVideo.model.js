"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutVideo = void 0;
const mongoose_1 = require("mongoose");
const WorkoutVideoSchema = new mongoose_1.Schema({
    video: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
}, { timestamps: true });
exports.WorkoutVideo = (0, mongoose_1.model)("WorkoutVideo", WorkoutVideoSchema);
