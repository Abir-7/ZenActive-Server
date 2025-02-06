"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateChallengeSchema = exports.zodChallengeSchema = void 0;
const zod_1 = require("zod");
// Zod schema for creating a challenge (all fields required)
exports.zodChallengeSchema = zod_1.z.object({
    body: zod_1.z.object({
        challengeName: zod_1.z.string().min(1, { message: "Challenge name is required" }),
        duration: zod_1.z.string().min(1, { message: "Duration is required" }),
        rewardPoints: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" }),
        goal: zod_1.z.string().min(1, { message: "Goal is required" }),
    }),
});
// Zod schema for updating a challenge (all fields optional)
exports.zodUpdateChallengeSchema = zod_1.z.object({
    body: zod_1.z.object({
        challengeName: zod_1.z
            .string()
            .min(1, { message: "Challenge name must be a non-empty string" })
            .optional(),
        duration: zod_1.z
            .string()
            .min(1, { message: "Duration must be a non-empty string" })
            .optional(),
        rewardPoints: zod_1.z
            .number()
            .positive({ message: "Reward points must be a positive number" })
            .optional(),
        goal: zod_1.z
            .string()
            .min(1, { message: "Goal must be a non-empty string" })
            .optional(),
    }),
});
