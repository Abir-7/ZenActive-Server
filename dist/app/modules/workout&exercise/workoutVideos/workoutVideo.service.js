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
exports.WorkoutVideoService = void 0;
const workoutVideo_model_1 = require("./workoutVideo.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const getAllWorkoutVideos = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield workoutVideo_model_1.WorkoutVideo.find().exec();
});
const getSingleWorkoutVideos = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield workoutVideo_model_1.WorkoutVideo.findOne({ _id: id }).exec();
    if (!data) {
        throw new AppError_1.default(404, "Video data not found");
    }
    return data;
});
const createWorkoutVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const workoutVideo = yield workoutVideo_model_1.WorkoutVideo.create(payload);
    if (!workoutVideo) {
        (0, unlinkFiles_1.default)(payload.video);
        (0, unlinkFiles_1.default)(payload.image);
    }
    return workoutVideo;
});
const updateWorkoutVideo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isWorkoutVideo = yield workoutVideo_model_1.WorkoutVideo.findById(id).exec();
    if (!isWorkoutVideo) {
        throw new AppError_1.default(404, "Workout video not found or already deleted.");
    }
    if (isWorkoutVideo && payload.video) {
        (0, unlinkFiles_1.default)(isWorkoutVideo.video);
    }
    if (isWorkoutVideo && payload.image) {
        (0, unlinkFiles_1.default)(isWorkoutVideo.image);
    }
    const updatedWorkout = yield workoutVideo_model_1.WorkoutVideo.findByIdAndUpdate(id, payload, {
        new: true,
    }).exec();
    if (!updatedWorkout) {
        if (payload.image)
            (0, unlinkFiles_1.default)(payload.image);
        if (payload.video)
            (0, unlinkFiles_1.default)(payload.video);
        throw new AppError_1.default(404, "Workout video not found or already deleted.");
    }
    return updatedWorkout;
});
const deleteWorkoutVideo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedWorkout = yield workoutVideo_model_1.WorkoutVideo.findByIdAndDelete(id).exec();
    if (!deletedWorkout) {
        throw new AppError_1.default(404, "Workout video not found or already deleted.");
    }
    return deletedWorkout;
});
exports.WorkoutVideoService = {
    getAllWorkoutVideos,
    createWorkoutVideo,
    updateWorkoutVideo,
    deleteWorkoutVideo,
    getSingleWorkoutVideos,
};
