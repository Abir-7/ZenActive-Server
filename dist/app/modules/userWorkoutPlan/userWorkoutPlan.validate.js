"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodStartWorkoutPlanSchema = void 0;
const zod_1 = require("zod");
exports.zodStartWorkoutPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        workoutPlanId: zod_1.z
            .string()
            .min(1, { message: "Workout Plan ID is required" }),
    }),
});
