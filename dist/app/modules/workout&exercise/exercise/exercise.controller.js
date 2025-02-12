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
exports.WorkoutController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const exercise_service_1 = require("./exercise.service");
const createExercise = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let video = null;
    let image = null;
    if (req.files && "media" in req.files && req.files.media[0]) {
        video = `/medias/${req.files.media[0].filename}`;
    }
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { video,
        image });
    const result = yield exercise_service_1.ExerciseService.createExercise(value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Exercise created successfully.",
    });
}));
// Get all exercises
const getAllExercise = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole, userId } = req.user;
    const result = yield exercise_service_1.ExerciseService.getAllExercise(userRole, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise fetched successfully.",
    });
}));
// Get an exercise by ID
const getExerciseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield exercise_service_1.ExerciseService.getExerciseById(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise fetched successfully.",
    });
}));
// Update an exercise by ID
const updateExercise = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    let video = null;
    let value = null;
    if (req.files && "media" in req.files && req.files.media[0]) {
        video = `/medias/${req.files.media[0].filename}`;
    }
    if (video) {
        value = Object.assign(Object.assign({}, req.body), { video });
    }
    else {
        value = req.body;
    }
    const result = yield exercise_service_1.ExerciseService.updateExercise(id, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise updated successfully.",
    });
}));
// Delete an exercise by ID
const deleteExercise = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield exercise_service_1.ExerciseService.deleteExercise(id);
    (0, sendResponse_1.default)(res, {
        data: { message: "Exercise deleted successfully." },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise deleted successfully.",
    });
}));
// Group all controller functions into an object
exports.WorkoutController = {
    createExercise,
    deleteExercise,
    getAllExercise,
    getExerciseById,
    updateExercise,
};
