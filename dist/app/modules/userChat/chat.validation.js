"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodChatSchema = void 0;
const zod_1 = require("zod");
exports.zodChatSchema = zod_1.z.object({
    body: zod_1.z.object({
        senderId: zod_1.z.string({
            required_error: "Sender ID is required",
        }),
        receiverId: zod_1.z.string({
            required_error: "Receiver ID is required",
        }),
        message: zod_1.z.string({
            required_error: "Message is required",
        }),
    }),
});
