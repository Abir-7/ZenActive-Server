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
exports.WorkoutService = void 0;
const workout_model_1 = __importDefault(require("./workout.model"));
// Create a new workout
const createWorkout = (workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = new workout_model_1.default(workoutData);
    return yield workout.save();
});
// Get all workouts
const getAllWorkouts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.find().populate("exercises").exec();
});
// Get a workout by ID
const getWorkoutById = (workoutId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.findById(workoutId).populate("exercises").exec();
});
// Update a workout by ID
const updateWorkout = (workoutId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.findByIdAndUpdate(workoutId, updateData, { new: true })
        .populate("exercises")
        .exec();
});
// Delete a workout by ID
const deleteWorkout = (workoutId) => __awaiter(void 0, void 0, void 0, function* () {
    yield workout_model_1.default.findByIdAndDelete(workoutId).exec();
});
// Add an exercise to a workout
const addExerciseToWorkout = (workoutId, exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.findByIdAndUpdate(workoutId, { $push: { exercises: exerciseId } }, { new: true })
        .populate("exercises")
        .exec();
});
// Remove an exercise from a workout
const removeExerciseFromWorkout = (workoutId, exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.findByIdAndUpdate(workoutId, { $pull: { exercises: exerciseId } }, { new: true })
        .populate("exercises")
        .exec();
});
exports.WorkoutService = {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
};
