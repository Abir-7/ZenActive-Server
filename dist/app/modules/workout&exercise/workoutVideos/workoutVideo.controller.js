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
exports.WorkoutVideoController = void 0;
const workoutVideo_service_1 = require("./workoutVideo.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const getAllWorkoutVideos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = req.query;
    const result = yield workoutVideo_service_1.WorkoutVideoService.getAllWorkoutVideos(Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout videos fetched successfully.",
    });
}));
const getSingleWorkoutVideos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutVideo_service_1.WorkoutVideoService.getSingleWorkoutVideos(req.params.id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout video is fetched successfully.",
    });
}));
const createWorkoutVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutVideo_service_1.WorkoutVideoService.createWorkoutVideo(req);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Workout video created successfully.",
    });
}));
const updateWorkoutVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield workoutVideo_service_1.WorkoutVideoService.updateWorkoutVideo(id, req);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout video updated successfully.",
    });
}));
const deleteWorkoutVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield workoutVideo_service_1.WorkoutVideoService.deleteWorkoutVideo(id);
    (0, sendResponse_1.default)(res, {
        data: null,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout video deleted successfully.",
    });
}));
exports.WorkoutVideoController = {
    getAllWorkoutVideos,
    createWorkoutVideo,
    updateWorkoutVideo,
    deleteWorkoutVideo,
    getSingleWorkoutVideos,
};
