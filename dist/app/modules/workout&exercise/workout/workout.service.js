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
const mongoose_1 = require("mongoose");
const workout_model_1 = __importDefault(require("./workout.model"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const exercise_model_1 = __importDefault(require("../exercise/exercise.model"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
// Create a new workout
const createWorkout = (workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = new workout_model_1.default(workoutData);
    if (!workout && workoutData.image) {
        (0, unlinkFiles_1.default)(workoutData.image);
    }
    return yield workout.save();
});
// Get all workouts
const getAllWorkouts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query.isDeleted = false;
    const workout = new QueryBuilder_1.default(workout_model_1.default.find().populate("exercises"), query)
        .search(["name"])
        .filter()
        .sort()
        .paginate();
    const result = yield workout.modelQuery;
    const meta = yield workout.countTotal();
    return { result, meta };
});
//Get a workout by ID
const getWorkoutById = (workoutId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield workout_model_1.default.findById(workoutId).populate("exercises").exec();
});
const getWorkoutsExerciseById = (workoutId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const workouts = yield workout_model_1.default.aggregate([
        { $match: { _id: workoutId } },
        {
            $lookup: {
                from: "exercises",
                localField: "exercises",
                foreignField: "_id",
                as: "exercises",
            },
        },
        {
            $lookup: {
                from: "dailyexercises",
                let: { exerciseIds: "$exercises._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$userId", userObjectId] },
                                    { $in: ["$exerciseId", "$$exerciseIds"] },
                                ],
                            },
                        },
                    },
                ],
                as: "dailyExercises",
            },
        },
        {
            $addFields: {
                completedExerciseIds: {
                    $map: {
                        input: "$dailyExercises",
                        as: "de",
                        in: "$$de.exerciseId",
                    },
                },
            },
        },
        {
            $addFields: {
                exercises: {
                    $map: {
                        input: "$exercises",
                        as: "exercise",
                        in: {
                            $mergeObjects: [
                                "$$exercise",
                                {
                                    isCompleted: {
                                        $in: ["$$exercise._id", "$completedExerciseIds"],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        {
            $project: { dailyExercises: 0, completedExerciseIds: 0 },
        },
    ]);
    if (!workouts || workouts.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Workout not found.");
    }
    return workouts[0].exercises;
});
// Update a workout by ID
const updateWorkout = (workoutId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const workoutData = yield workout_model_1.default.findById(workoutId);
    if (workoutData && updateData.image) {
        (0, unlinkFiles_1.default)(workoutData.image);
    }
    return yield workout_model_1.default.findByIdAndUpdate(workoutId, updateData, { new: true })
        .populate("exercises")
        .exec();
});
// Delete a workout by ID
const deleteWorkout = (workoutId) => __awaiter(void 0, void 0, void 0, function* () {
    yield workout_model_1.default.findByIdAndUpdate(workoutId, { isDeleted: true }, { new: true }).exec();
});
// Add an exercise to a workout
const addExerciseToWorkout = (workoutId, exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findOne({ _id: exerciseId });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exercise not found.");
    }
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
    getWorkoutsExerciseById,
};
