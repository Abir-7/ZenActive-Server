"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateBadgeSchema = exports.zodBadgeSchema = void 0;
const zod_1 = require("zod");
exports.zodBadgeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        points: zod_1.z.number().min(0, "Points must be a positive number"),
    }),
});
exports.zodUpdateBadgeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        points: zod_1.z.number().min(0, "Points must be a positive number").optional(),
    }),
});
