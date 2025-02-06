"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodBlockSchema = void 0;
const zod_1 = require("zod");
exports.zodBlockSchema = zod_1.z.object({
    body: zod_1.z.object({
        blockedUserId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"), //
    }),
});
