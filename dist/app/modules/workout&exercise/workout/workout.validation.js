"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodWorkoutSchema = void 0;
const zod_1 = require("zod");
exports.zodWorkoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .nonempty({ message: "Name is required and cannot be empty." }),
        description: zod_1.z
            .string()
            .nonempty({ message: "Description is required and cannot be empty." }),
        exercises: zod_1.z
            .array(zod_1.z.string().nonempty({ message: "Each exercise ID cannot be empty." }))
            .nonempty({ message: "At least one exercise ID is required." }),
        points: zod_1.z
            .number()
            .positive({ message: "Points must be a positive number." }),
    }),
});
