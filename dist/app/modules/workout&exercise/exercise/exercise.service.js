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
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const dailyExercise_model_1 = __importDefault(require("../../usersDailyExercise/dailyExercise.model"));
const exercise_model_1 = __importDefault(require("./exercise.model"));
// Create a new exercise
const createExercise = (exerciseData) => __awaiter(void 0, void 0, void 0, function* () {
    const exercise = yield exercise_model_1.default.create(Object.assign(Object.assign({}, exerciseData), { duration: Number(exerciseData.duration * 60) }));
    if (!exercise && exerciseData.image) {
        (0, unlinkFiles_1.default)(exerciseData.image);
    }
    return exercise;
});
const getAllExercise = (userRole, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userRole === "ADMIN") {
        // For admin, return all active exercises.
        return yield exercise_model_1.default.find({ isDeleted: false }).exec();
    }
    else {
        // Calculate today's boundaries.
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return yield exercise_model_1.default.aggregate([
            // Only include active (not deleted) exercises.
            { $match: { isDeleted: false } },
            // Lookup daily exercise records for the current user and only for today.
            {
                $lookup: {
                    from: "dailyexercises", // Use your actual DailyExercise collection name.
                    let: { exerciseId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$exerciseId", "$$exerciseId"] },
                                        { $eq: ["$userId", new mongoose_1.default.Types.ObjectId(userId)] },
                                        { $gte: ["$completedDate", startOfToday] },
                                        { $lte: ["$completedDate", endOfToday] },
                                    ],
                                },
                            },
                        },
                        // Optionally, project only the fields you need.
                        { $project: { _id: 1 } },
                    ],
                    as: "dailyExercise",
                },
            },
            // Add the isCompleted field: true if there's at least one matching daily exercise.
            {
                $addFields: {
                    isCompleted: { $gt: [{ $size: "$dailyExercise" }, 0] },
                },
            },
            // Optionally, remove the dailyExercise field from the output.
            {
                $project: { dailyExercise: 0 },
            },
        ]);
    }
});
// Get an exercise by ID
const getExerciseById = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const [participantCount, exercise] = yield Promise.all([
        dailyExercise_model_1.default.countDocuments({ exerciseId }),
        exercise_model_1.default.findById(exerciseId).exec(),
    ]);
    return { exercise, participant: participantCount };
});
// Update an exercise by ID
const updateExercise = (exerciseId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findById(exerciseId);
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
    }
    if (updateData.image) {
        (0, unlinkFiles_1.default)(isExist.image);
    }
    if (updateData.video) {
        (0, unlinkFiles_1.default)(isExist.video);
    }
    const updated = yield exercise_model_1.default.findByIdAndUpdate(exerciseId, updateData, {
        new: true,
    }).exec();
    if (!(updated === null || updated === void 0 ? void 0 : updated._id)) {
        throw new AppError_1.default(404, "Failed to Update");
    }
    return updated;
});
const deleteExercise = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findByIdAndUpdate(exerciseId, { isDeleted: true }, { new: true });
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
    }
    return { message: "Exercise deleted" };
});
// Group all service functions into an object
exports.ExerciseService = {
    createExercise,
    getAllExercise,
    getExerciseById,
    updateExercise,
    deleteExercise,
};
