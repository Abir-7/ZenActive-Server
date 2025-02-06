"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodPackageSchema = void 0;
const zod_1 = require("zod");
const TimeIntervalSchema = zod_1.z.enum([
    "day",
    "week",
    "month",
    "year",
    "half-year",
]);
exports.zodPackageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        features: zod_1.z.array(zod_1.z.string()).min(1, "Description is required"),
        unitAmount: zod_1.z.number().min(0, "Unit amount must be a positive number"),
        interval: TimeIntervalSchema,
    }),
});
