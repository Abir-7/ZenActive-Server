"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateWorkoutPlanSchema = exports.zodWorkoutPlanSchema = void 0;
const zod_1 = require("zod");
exports.zodWorkoutPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Title is required" }),
        duration: zod_1.z
            .number()
            .positive({ message: "Duration must be a positive number" }),
        workouts: zod_1.z.array(zod_1.z.string().min(1, { message: "Exercise name is required" })),
        rewardPoints: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" }),
        isDeleted: zod_1.z.boolean().optional().default(false),
    }),
});
exports.zodUpdateWorkoutPlanSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Title is required" }).optional(),
        duration: zod_1.z
            .number()
            .positive({ message: "Duration must be a positive number" })
            .optional(),
        workouts: zod_1.z
            .array(zod_1.z.string().min(1, { message: "Exercise name is required" }))
            .optional(),
        rewardPoints: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" })
            .optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
})
    .optional();
