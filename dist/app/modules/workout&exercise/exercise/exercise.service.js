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
exports.ExerciseService = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const exercise_model_1 = __importDefault(require("./exercise.model"));
// Create a new exercise
const createExercise = (exerciseData) => __awaiter(void 0, void 0, void 0, function* () {
    const exercise = yield exercise_model_1.default.create(exerciseData);
    return exercise;
});
// Get all exercises
const getAllExercise = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield exercise_model_1.default.find().exec();
});
// Get an exercise by ID
const getExerciseById = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exercise_model_1.default.findById(exerciseId).exec();
});
// Update an exercise by ID
const updateExercise = (exerciseId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findById(exerciseId);
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
    }
    (0, unlinkFiles_1.default)(isExist.video);
    const updated = yield exercise_model_1.default.findByIdAndUpdate(exerciseId, updateData, {
        new: true,
    }).exec();
    if (!(updated === null || updated === void 0 ? void 0 : updated._id)) {
        throw new AppError_1.default(404, "Failed to Update");
    }
    return updated;
});
// Delete an exercise by ID
const deleteExercise = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findById(exerciseId);
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
    }
    (0, unlinkFiles_1.default)(isExist.video);
    yield exercise_model_1.default.findByIdAndDelete(exerciseId).exec();
});
// Group all service functions into an object
exports.ExerciseService = {
    createExercise,
    getAllExercise,
    getExerciseById,
    updateExercise,
    deleteExercise,
};
