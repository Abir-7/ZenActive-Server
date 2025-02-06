"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodExerciseSchema = void 0;
const zod_1 = require("zod");
exports.zodExerciseSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }),
        sets: zod_1.z.number({
            required_error: "Sets is required",
            invalid_type_error: "Sets must be a number",
        }),
        reps: zod_1.z.number({
            required_error: "Reps is required",
            invalid_type_error: "Reps must be a number",
        }),
        restTime: zod_1.z.number({
            required_error: "Rest time is required",
            invalid_type_error: "Rest time must be a number",
        }),
        points: zod_1.z.number({
            required_error: "Points is required",
            invalid_type_error: "Points must be a number",
        }),
    }),
});
