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
exports.AppDataService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const appdata_model_1 = require("./appdata.model");
const http_status_1 = __importDefault(require("http-status"));
const addPoints = (point, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const appData = yield appdata_model_1.UserAppData.findOne({ userId });
    if (!appData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User app data not found.");
    }
    appData.points = ((appData === null || appData === void 0 ? void 0 : appData.points) || 0) + point;
    yield appData.save();
    return appData;
});
const addWorkoutTime = (time, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const appData = yield appdata_model_1.UserAppData.findOne({ userId });
    if (!appData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User app data not found.");
    }
    appData.completedWorkoutTime = ((appData === null || appData === void 0 ? void 0 : appData.completedWorkoutTime) || 0) + time;
    yield appData.save();
    return appData;
});
const getLeaderboard = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    // Get total count for pagination
    const total = yield appdata_model_1.UserAppData.countDocuments();
    const totalPage = Math.ceil(total / limit);
    // Fetch leaderboard sorted by points in descending order
    const leaderboard = yield appdata_model_1.UserAppData.find()
        .populate({
        path: "userId",
        select: "_id name email image",
        options: { lean: true },
    })
        .sort({ points: -1 }) // Sorting by points (descending)
        .skip(skip)
        .limit(limit)
        .lean();
    return {
        meta: { limit, page, total, totalPage },
        data: leaderboard,
    };
});
exports.AppDataService = {
    addPoints,
    addWorkoutTime,
    getLeaderboard,
};
