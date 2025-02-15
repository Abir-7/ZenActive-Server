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
const mongoose_1 = require("mongoose");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const workout_service_1 = require("./workout.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const createWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { image });
    const result = yield workout_service_1.WorkoutService.createWorkout(value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Workout created successfully.",
    });
}));
const getAllWorkouts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workout_service_1.WorkoutService.getAllWorkouts(req.query);
    (0, sendResponse_1.default)(res, {
        data: result.result,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workouts fetched successfully.",
    });
}));
const getWorkoutById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield workout_service_1.WorkoutService.getWorkoutById(new mongoose_1.Types.ObjectId(id));
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout fetched successfully.",
    });
}));
const getWorkoutsExerciseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield workout_service_1.WorkoutService.getWorkoutsExerciseById(new mongoose_1.Types.ObjectId(id), userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User workout data fetched successfully.",
    });
}));
const updateWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let image = null;
    let value = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (image) {
        value = Object.assign(Object.assign({}, req.body), { image });
    }
    else {
        value = req.body;
    }
    const result = yield workout_service_1.WorkoutService.updateWorkout(new mongoose_1.Types.ObjectId(id), value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Workout updated successfully.",
    });
}));
const deleteWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield workout_service_1.WorkoutService.deleteWorkout(new mongoose_1.Types.ObjectId(id));
    (0, sendResponse_1.default)(res, {
        data: null,
        success: true,
        statusCode: http_status_1.default.NO_CONTENT,
        message: "Workout deleted successfully.",
    });
}));
const addExerciseToWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workoutId, exerciseId } = req.body;
    const result = yield workout_service_1.WorkoutService.addExerciseToWorkout(workoutId, exerciseId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise added to workout successfully.",
    });
}));
const removeExerciseFromWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workoutId, exerciseId } = req.body;
    const result = yield workout_service_1.WorkoutService.removeExerciseFromWorkout(workoutId, exerciseId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exercise removed from workout successfully.",
    });
}));
exports.WorkoutController = {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    getWorkoutsExerciseById,
};
