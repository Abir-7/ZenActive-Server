"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodPostSchema = void 0;
const zod_1 = require("zod");
exports.zodPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1),
    }),
});
