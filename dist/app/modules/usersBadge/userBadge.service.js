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
exports.UserBadgeService = void 0;
const userBadge_model_1 = require("./userBadge.model");
const badge_model_1 = __importDefault(require("../badge/badge.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const appdata_model_1 = require("../userAppData/appdata.model");
const createOrUpdateUserBadge = (userId, badgeId) => __awaiter(void 0, void 0, void 0, function* () {
    const appdata = yield appdata_model_1.UserAppData.findOne({ userId });
    console.log(appdata);
    const isExist = yield badge_model_1.default.findOne({
        _id: badgeId,
        isDeleted: false,
    });
    console.log(isExist === null || isExist === void 0 ? void 0 : isExist.points);
    if (!isExist) {
        throw new AppError_1.default(404, "Badge not found.");
    }
    if ((appdata === null || appdata === void 0 ? void 0 : appdata.points) && (appdata === null || appdata === void 0 ? void 0 : appdata.points) < (isExist === null || isExist === void 0 ? void 0 : isExist.points)) {
        throw new AppError_1.default(404, "You have not enough points.");
    }
    // Check if the user-badge relationship already exists
    const existingUserBadge = yield userBadge_model_1.UserBadge.findOne({ userId }).exec();
    if (existingUserBadge) {
        // If it exists, update the badgeId
        existingUserBadge.badgeId = badgeId;
        return yield existingUserBadge.save();
    }
    else {
        // If it doesn't exist, create a new user-badge relationship
        const userBadge = new userBadge_model_1.UserBadge({ userId, badgeId });
        return yield userBadge.save();
    }
});
const getUserBadgeById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userBadge_model_1.UserBadge.findOne({ userId }).populate("badgeId").exec();
    return data;
});
exports.UserBadgeService = {
    createOrUpdateUserBadge,
    getUserBadgeById,
};
