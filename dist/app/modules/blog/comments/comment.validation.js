"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodVideoCommentSchema = exports.zodCommentSchema = void 0;
const zod_1 = require("zod");
exports.zodCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z.string(),
        comment: zod_1.z.string().min(1),
    }),
});
exports.zodVideoCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        videoId: zod_1.z.string(),
        comment: zod_1.z.string().min(1),
    }),
});
