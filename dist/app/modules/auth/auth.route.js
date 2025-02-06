"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validator_1 = __importDefault(require("../../middleware/validator"));
const auth_validation_1 = require("./auth.validation");
const user_validation_1 = require("../user/user.validation");
const router = (0, express_1.Router)();
router.post("/login", (0, validator_1.default)(auth_validation_1.zodLoginSchema), auth_controller_1.AuthController.loginUser);
router.patch("/verify-user", (0, validator_1.default)(user_validation_1.zodVerifyEmailSchema), auth_controller_1.AuthController.verifyUser);
router.post("/forgot-pass", (0, validator_1.default)(auth_validation_1.zodForgotPassSchema), auth_controller_1.AuthController.forgotPass);
router.post("/reset-pass", (0, validator_1.default)(auth_validation_1.zodResetPassSchema), auth_controller_1.AuthController.resetPassword);
router.post("/resend-code", (0, validator_1.default)(auth_validation_1.zodResendCodeSchema), auth_controller_1.AuthController.reSendOtp);
exports.AuthRoute = router;
