"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodResendCodeSchema = exports.zodResetPassSchema = exports.zodForgotPassSchema = exports.zodLoginSchema = void 0;
const zod_1 = require("zod");
exports.zodLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email(),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
exports.zodForgotPassSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email(),
    }),
});
exports.zodResetPassSchema = zod_1.z.object({
    body: zod_1.z.object({
        new_password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long."),
        confirm_password: zod_1.z
            .string({ required_error: "Confirm Password is required." })
            .min(6, "Confirm Password must be at least 6 characters long."),
    }),
});
exports.zodResendCodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Give original Email." }),
    }),
});
