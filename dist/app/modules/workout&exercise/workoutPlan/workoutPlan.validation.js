"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateWorkoutPlanSchema = exports.zodWorkoutPlanSchema = void 0;
const zod_1 = require("zod");
exports.zodWorkoutPlanSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        description: zod_1.z.string().min(1, { message: "Description is required" }),
        duration: zod_1.z
            .number()
            .positive({ message: "Duration must be a positive number" }),
        points: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" }),
        about: zod_1.z.string().min(1, { message: "About section is required" }),
    }),
})
    .strict();
exports.zodUpdateWorkoutPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
        description: zod_1.z
            .string()
            .min(1, { message: "Description is required" })
            .optional(),
        duration: zod_1.z
            .number()
            .positive({ message: "Duration must be a positive number" })
            .optional(),
        points: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" })
            .optional(),
        about: zod_1.z
            .string()
            .min(1, { message: "About section is required" })
            .optional(),
    }),
});
