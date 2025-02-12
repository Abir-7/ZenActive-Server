"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodVerifyEmailSchema = exports.zodUserUpdateSchema = exports.zodCreateUserSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.zodCreateUserSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required." })
            .email("Please provide a valid email address."),
        password: zod_1.z
            .string({ required_error: "Password is required." })
            .min(6, "Password must be at least 6 characters long."),
        confirm_password: zod_1.z
            .string({ required_error: "Confirm Password is required." })
            .min(6, "Confirm Password must be at least 6 characters long."),
        fcmToken: zod_1.z
            .string({ required_error: "fcmToeken is required." })
            .min(6, "fcmToeken must be at least 6 characters long."),
    }),
})
    .strict();
exports.zodUserUpdateSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        medicalCondition: zod_1.z
            .enum(Object.values(user_interface_1.MedicalCondition))
            .optional(),
        movementDifficulty: zod_1.z
            .enum(Object.values(user_interface_1.MovementDifficulty))
            .optional(),
        injury: zod_1.z.enum(Object.values(user_interface_1.Injury)).optional(),
        activityLevel: zod_1.z
            .enum(Object.values(user_interface_1.ActivityLevel))
            .optional(),
        diet: zod_1.z.enum(Object.values(user_interface_1.DietType)).optional(),
        primaryGoal: zod_1.z
            .enum(Object.values(user_interface_1.PrimaryGoals))
            .optional(),
        weight: zod_1.z.number().min(1, "Weight must be a positive number").optional(),
        height: zod_1.z.number().min(1, "Height must be a positive number").optional(),
        gender: zod_1.z.enum(Object.values(user_interface_1.Gender)).optional(),
        dateOfBirth: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
            .transform((val) => new Date(val))
            .optional(), // Converts the string to a Date
        name: zod_1.z
            .object({
            firstName: zod_1.z.string().min(1, "First name is required"),
            lastName: zod_1.z.string().min(1, "Last name is required"),
        })
            .optional(),
    }),
})
    .strict();
// verify user
exports.zodVerifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        code: zod_1.z
            .union([zod_1.z.string().transform((val) => parseFloat(val)), zod_1.z.number()])
            .refine((val) => !isNaN(val), {
            message: "One time code is required",
        }),
    }),
});
