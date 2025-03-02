"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodWorkoutVideoSchema = void 0;
const zod_1 = require("zod");
exports.zodWorkoutVideoSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
    }),
});
