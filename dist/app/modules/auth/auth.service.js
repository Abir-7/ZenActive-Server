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
exports.AuthService = void 0;
const config_1 = require("../../config");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cryptoToken_1 = __importDefault(require("../../utils/cryptoToken"));
const generateOtp_1 = __importDefault(require("../../utils/generateOtp"));
const jwtHelper_1 = require("../../utils/jwtHelper");
const sendEmail_1 = require("../../utils/sendEmail");
const resetToken_model_1 = require("../resetToken/resetToken.model");
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: userData.email })
        .select("+password")
        .populate("appData");
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Blocked");
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Deleted");
    }
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Please check your email.");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Please verify your email.");
    }
    if (!(yield user_model_1.User.passwordMatch(isUserExist.password, userData.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password not matched.");
    }
    if (isUserExist.fcmToken !== userData.fcmToken) {
        yield user_model_1.User.findOneAndUpdate({ email: userData.email }, { fcmToken: userData.fcmToken }, { new: true });
    }
    console.log("hit");
    const jwtPayload = {
        userEmail: isUserExist.email,
        userId: isUserExist._id,
        userRole: isUserExist.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.config.security.jwt.secret, config_1.config.security.jwt.refreshExpiresIn);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.config.security.jwt.refreshSecret, config_1.config.security.jwt.refreshExpiresIn);
    return {
        accessToken,
        refreshToken,
        user: {
            email: isUserExist.email,
            role: isUserExist.role,
            _id: isUserExist._id,
        },
    };
});
const verifyUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ email: userData.email }).select("+authentication");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!Number(userData.code)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please give the otp, check your email.");
    }
    if (((_a = user === null || user === void 0 ? void 0 : user.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== Number(userData.code)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Code not matched.");
    }
    if (((_b = user === null || user === void 0 ? void 0 : user.authentication) === null || _b === void 0 ? void 0 : _b.expireAt) <= new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Code has expired");
    }
    if (!user.isVerified) {
        const result = yield user_model_1.User.findOneAndUpdate({ email: userData.email }, {
            $set: {
                isVerified: true,
                "authentication.oneTimeCode": null,
                "authentication.expireAt": null,
            },
        }, { new: true });
        return {
            data: result === null || result === void 0 ? void 0 : result.email,
            message: "Email verification successful.",
        };
    }
    else {
        const updatedData = {
            isResetPassword: true,
            oneTimeCode: null,
            expireAt: null,
        };
        yield user_model_1.User.findOneAndUpdate({ email: userData.email }, {
            authentication: updatedData,
        }, { new: true });
        const createToken = (0, cryptoToken_1.default)();
        yield resetToken_model_1.ResetToken.create({
            user: user._id,
            token: createToken,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
        });
        return {
            data: createToken,
            message: "Verification Successful: Please securely store and utilize this code for reset password",
        };
    }
});
const forgotPass = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: userEmail });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Email not found.");
    }
    const OTP = (0, generateOtp_1.default)();
    yield (0, sendEmail_1.sendEmail)(userEmail, "Reset Password Verification Code", `CODE: ${OTP}`);
    const updatedData = {
        isResetPassword: false,
        oneTimeCode: OTP,
        expireAt: new Date(Date.now() + 10 * 60 * 1000), //10min
    };
    yield user_model_1.User.findOneAndUpdate({ email: userEmail }, {
        authentication: updatedData,
    });
    return { userEmail };
});
const resetPassword = (token, userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { new_password, confirm_password } = userData;
    const isExistToken = yield resetToken_model_1.ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const isUserExist = yield user_model_1.User.findOne({ _id: isExistToken.user }).select("+authentication");
    if (!((_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.authentication) === null || _a === void 0 ? void 0 : _a.isResetPassword)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    //validity check
    const isValid = yield resetToken_model_1.ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Token expired, Please click again to the forget password");
    }
    //check password
    if (new_password !== confirm_password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = yield bcryptjs_1.default.hash(new_password, Number(config_1.config.security.bcryptSaltRounds));
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        },
    };
    yield user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
    return "Password changed.";
});
const reSendOtp = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const OTP = (0, generateOtp_1.default)();
    const updateUser = yield user_model_1.User.findOneAndUpdate({ email: userEmail }, {
        $set: {
            "authentication.oneTimeCode": OTP,
            "authentication.expireAt": new Date(Date.now() + 10 * 60 * 1000), //10min
        },
    }, { new: true });
    if (!updateUser) {
        throw new AppError_1.default(500, "Failed to Send. Try Again!");
    }
    yield (0, sendEmail_1.sendEmail)(userEmail, "Verification Code", `CODE: ${OTP}`);
    return { message: "Verification Send" };
});
exports.AuthService = {
    loginUser,
    forgotPass,
    verifyUser,
    resetPassword,
    reSendOtp,
};
