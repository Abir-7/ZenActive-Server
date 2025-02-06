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
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const calculateTDEE_1 = require("../../utils/calculateTDEE");
const generateOtp_1 = __importDefault(require("../../utils/generateOtp"));
const sendEmail_1 = require("../../utils/sendEmail");
const unlinkFiles_1 = __importDefault(require("../../utils/unlinkFiles"));
const appdata_model_1 = require("../userAppData/appdata.model");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: userData.email });
    if (isExist) {
        throw new AppError_1.default(400, "User already exist");
    }
    //check password
    if (userData.password !== userData.confirm_password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password not match.");
    }
    //create otp
    const OTP = (0, generateOtp_1.default)();
    //create user
    const result = yield user_model_1.User.create({
        email: userData.email,
        password: userData.password,
        fcmToken: userData.fcmToken,
        "authentication.oneTimeCode": OTP,
        "authentication.expireAt": new Date(Date.now() + 10 * 60 * 1000), //10min,
    });
    if (result) {
        //send email
        (0, sendEmail_1.sendEmail)(userData.email, "Email Verification Code", `CODE: ${OTP}`);
        return { userId: result._id, userEmail: result.email };
    }
    else {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to create user.");
    }
});
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to update. User not found.");
    }
    // Destructure userData for easier access
    const { medicalCondition, movementDifficulty, injury, activityLevel, diet, primaryGoal, weight, height, gender, dateOfBirth, name, } = userData;
    const isProfileComplete = medicalCondition &&
        movementDifficulty &&
        injury &&
        activityLevel &&
        diet &&
        primaryGoal &&
        typeof weight === "number" &&
        typeof height === "number" &&
        gender &&
        dateOfBirth &&
        (name === null || name === void 0 ? void 0 : name.firstName) &&
        (name === null || name === void 0 ? void 0 : name.lastName) &&
        !isUserExist.isProfileUpdated;
    let appData;
    // Calculate TDEE and create/update UserAppData if the profile is complete
    if (isProfileComplete) {
        const tdee = (0, calculateTDEE_1.calculateTDEE)(userData).toFixed(2);
        appData = yield appdata_model_1.UserAppData.findOneAndUpdate({ userId }, { tdee }, { upsert: true, new: true });
    }
    (0, unlinkFiles_1.default)(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.image);
    // Update the user with the provided data
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: userId }, Object.assign(Object.assign({}, userData), { isProfileUpdated: isProfileComplete || isUserExist.isProfileUpdated, appData: appData === null || appData === void 0 ? void 0 : appData._id }), { new: true });
    return updatedUser;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false, role: "USER" }).populate("appData"), query)
        .search(["name.firstName", "name.lastName", "email"])
        .paginate();
    const result = yield users.modelQuery;
    return result;
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "userbadges",
                localField: "_id",
                foreignField: "userId",
                as: "badges",
            },
        },
        {
            $lookup: {
                from: "badges",
                localField: "badges.badgeId",
                foreignField: "_id",
                as: "badges",
            },
        },
        {
            $lookup: {
                from: "userappdatas",
                localField: "appData",
                foreignField: "_id",
                as: "appData",
            },
        },
        { $unwind: { path: "$appData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$badges", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                password: 0,
                authentication: 0,
            },
        },
    ]);
    if (!user || user.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user[0].isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is Blocked");
    }
    if (user[0].isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is Deleted");
    }
    return user[0];
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserDeleted = yield user_model_1.User.findOne({ _id: userId });
    if (isUserDeleted === null || isUserDeleted === void 0 ? void 0 : isUserDeleted.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is already  deleted");
    }
    const user = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { isDeleted: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    return { message: "User deleted successfully." };
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserblocked = yield user_model_1.User.findOne({ _id: userId });
    if (isUserblocked === null || isUserblocked === void 0 ? void 0 : isUserblocked.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is already blocked");
    }
    const user = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { isBlocked: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    return { message: "User deleted successfully." };
});
exports.UserService = {
    createUser,
    deleteUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    blockUser,
};
