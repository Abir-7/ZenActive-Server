"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../../config");
const user_constant_1 = require("./user.constant");
exports.userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    role: {
        type: String,
        enum: user_constant_1.userRole,
        default: "USER",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
    },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, enum: Object.values(user_interface_1.Gender), required: false },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    primaryGoal: {
        type: String,
        enum: Object.values(user_interface_1.PrimaryGoals),
        required: false,
    },
    diet: {
        type: String,
        enum: Object.values(user_interface_1.DietType),
        required: false,
    },
    restriction: {
        type: String,
        enum: Object.values(user_interface_1.Restrictions),
        required: false,
    },
    activityLevel: {
        type: String,
        enum: Object.values(user_interface_1.ActivityLevel),
        required: false,
    },
    injury: {
        type: String,
        enum: Object.values(user_interface_1.Injury),
        required: false,
    },
    movementDifficulty: {
        type: String,
        enum: Object.values(user_interface_1.MovementDifficulty),
        required: false,
    },
    medicalCondition: {
        type: String,
        enum: Object.values(user_interface_1.MedicalCondition),
        required: false,
    },
    occupation: { type: String, required: false },
    additionalDetails: { type: String, required: false },
    image: {
        type: String,
        default: "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg",
    },
    mobile: { type: String },
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: false,
    },
    password: { type: String, required: true, select: false },
    isProfileUpdated: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    fcmToken: { type: String, unique: true },
    hasPremiumAccess: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcryptjs_1.default.hash(this.password.trim(), Number(config_1.config.security.bcryptSaltRounds));
        next();
    });
});
exports.userSchema.statics.passwordMatch = function (hashedPass, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, hashedPass);
    });
};
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
