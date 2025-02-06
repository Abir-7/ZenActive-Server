"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUpdateGroupSchema = exports.zodGroupSchema = void 0;
const zod_1 = require("zod");
exports.zodGroupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty({ message: "Name cannot be empty" }),
        type: zod_1.z.string().nonempty({ message: "Type cannot be empty" }),
        goal: zod_1.z.string().nonempty({ message: "Goal cannot be empty" }),
    }),
});
exports.zodUpdateGroupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty({ message: "Name cannot be empty" }).optional(),
        type: zod_1.z.string().nonempty({ message: "Type cannot be empty" }).optional(),
        goal: zod_1.z.string().nonempty({ message: "Goal cannot be empty" }).optional(),
    }),
});
