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
exports.AppDataController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const appdata_service_1 = require("./appdata.service");
const addPoints = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { points } = req.body;
    const result = yield appdata_service_1.AppDataService.addPoints(points, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User app data points updated successfully.",
        data: result,
    });
}));
const addWorkoutTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { time } = req.body;
    const result = yield appdata_service_1.AppDataService.addWorkoutTime(time, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User app data workout time updated successfully.",
        data: result,
    });
}));
const getLeaderboard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 50 } = req.query;
    const result = yield appdata_service_1.AppDataService.getLeaderboard(Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User leaderboard fetched successfully.",
        data: result.data,
        meta: result.meta,
    });
}));
exports.AppDataController = {
    addPoints,
    addWorkoutTime,
    getLeaderboard,
};
