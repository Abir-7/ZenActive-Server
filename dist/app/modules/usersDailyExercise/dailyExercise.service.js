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
exports.DailyExerciseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const exercise_model_1 = __importDefault(require("../workout&exercise/exercise/exercise.model"));
const dailyExercise_model_1 = __importDefault(require("./dailyExercise.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const appdata_model_1 = require("../userAppData/appdata.model");
const createDailyExercise = (dailyExerciseData) => __awaiter(void 0, void 0, void 0, function* () {
    const exerciseData = yield exercise_model_1.default.findOne({
        _id: dailyExerciseData.exerciseId,
    });
    if (!exerciseData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exercise  not found.");
    }
    const appData = yield appdata_model_1.UserAppData.findOne({
        userId: dailyExerciseData.userId,
    });
    if (!appData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Appdata  not found.");
    }
    appData.points = (appData === null || appData === void 0 ? void 0 : appData.points)
        ? (appData === null || appData === void 0 ? void 0 : appData.points) + exerciseData.points
        : 0 + exerciseData.points;
    appData.completedWorkoutTime = (appData === null || appData === void 0 ? void 0 : appData.completedWorkoutTime)
        ? (appData === null || appData === void 0 ? void 0 : appData.completedWorkoutTime) + exerciseData.duration
        : 0 + exerciseData.duration;
    yield appData.save();
    const dailyExercise = yield dailyExercise_model_1.default.create(dailyExerciseData);
    return dailyExercise;
});
const getDailyExerciseById = (dailyExerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return yield dailyExercise_model_1.default.find({
        exerciseId: dailyExerciseId,
        completedDate: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });
});
exports.DailyExerciseService = {
    createDailyExercise,
    getDailyExerciseById,
};
