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
exports.WorkoutPlanService = exports.deleteWorkout = exports.updateWorkout = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const workoutPlan_model_1 = require("./workoutPlan.model");
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const userWorkoutPlan_model_1 = __importDefault(require("../../userWorkoutPlan/userWorkoutPlan.model"));
const createWorkoutPlan = (workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(workoutData);
    if (workoutData.duration !== workoutData.workouts.length) {
        throw new AppError_1.default(500, `day:${workoutData.duration} not equal workouts:${workoutData.workouts.length} in numbner`);
    }
    const workout = yield workoutPlan_model_1.WorkoutPlan.create(workoutData);
    if (!workout) {
        (0, unlinkFiles_1.default)(workoutData.image);
    }
    return workout;
});
const updateWorkout = (workoutId, workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const isWorkoutExist = yield workoutPlan_model_1.WorkoutPlan.findOne({ _id: workoutId });
    if (!isWorkoutExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to update. Workout not found.");
    }
    if (isWorkoutExist.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update. Workout is deleted.");
    }
    const updatedWorkout = yield workoutPlan_model_1.WorkoutPlan.findOneAndUpdate({ _id: workoutId }, Object.assign({}, workoutData), {
        new: true,
    });
    if (!updatedWorkout) {
        (0, unlinkFiles_1.default)(isWorkoutExist.image);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update. ");
    }
    else {
        if (workoutData.image) {
            (0, unlinkFiles_1.default)(isWorkoutExist.image);
        }
    }
    return updatedWorkout;
});
exports.updateWorkout = updateWorkout;
const getAllWorkouts = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    query.isDeleted = false;
    const workoutPlans = yield workoutPlan_model_1.WorkoutPlan.find(query).populate({
        path: "workouts",
        populate: "exercises",
    });
    const workoutPlansWithStatus = yield Promise.all(workoutPlans.map((workoutPlan) => __awaiter(void 0, void 0, void 0, function* () {
        const userWorkoutPlan = yield userWorkoutPlan_model_1.default.findOne({
            userId,
            workoutPlanId: workoutPlan._id,
            isCompleted: "InProgress",
        });
        return Object.assign(Object.assign({}, workoutPlan.toObject()), { isEnrolled: userWorkoutPlan ? true : false });
    })));
    return workoutPlansWithStatus;
});
const getSingleWorkout = (workoutPlanId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userWorkoutPlan = yield userWorkoutPlan_model_1.default.findOne({
        userId,
        workoutPlanId: workoutPlanId,
        isCompleted: "InProgress",
    })
        .populate({
        path: "workoutPlanId",
        select: "title _id duration workouts",
        populate: {
            path: "workouts",
            select: "_id name description exercises",
            populate: {
                path: "exercises",
            },
        },
    })
        .lean();
    if (userWorkoutPlan === null || userWorkoutPlan === void 0 ? void 0 : userWorkoutPlan._id) {
        return userWorkoutPlan;
    }
    const workout = yield workoutPlan_model_1.WorkoutPlan.findById(workoutPlanId).populate({
        path: "workouts",
        populate: "exercises",
    });
    if (!workout) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Workout not found.");
    }
    if (workout.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Workout is deleted.");
    }
    return workout;
});
const getSingleWorkoutDefault = (workoutPlanId) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = yield workoutPlan_model_1.WorkoutPlan.findById(workoutPlanId).populate({
        path: "workouts",
        populate: "exercises",
    });
    if (!workout) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Workout not found.");
    }
    if (workout.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Workout is deleted.");
    }
    return workout;
});
const deleteWorkout = (workoutId) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = yield workoutPlan_model_1.WorkoutPlan.findById(workoutId);
    if (!workout) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Workout not found.");
    }
    yield workoutPlan_model_1.WorkoutPlan.findByIdAndDelete({ _id: workoutId }, {
        isDeleted: true,
    });
    return { message: "Workout deleted successfully" };
});
exports.deleteWorkout = deleteWorkout;
exports.WorkoutPlanService = {
    updateWorkout: exports.updateWorkout,
    createWorkoutPlan,
    getAllWorkouts,
    getSingleWorkout,
    deleteWorkout: exports.deleteWorkout,
    getSingleWorkoutDefault,
};
