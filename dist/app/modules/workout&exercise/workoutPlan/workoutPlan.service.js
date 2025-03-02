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
const getGeminiResponse_1 = require("../../../utils/getGeminiResponse");
const workout_model_1 = __importDefault(require("../workout/workout.model"));
const getJson_1 = require("../../../utils/getJson");
const createWorkoutPlan = (workoutData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    workoutData.duration = workoutData.duration * 7;
    const allWorkouts = yield workout_model_1.default.find({ isDeleted: false });
    // Extract only necessary fields to reduce token usage
    const availableWorkouts = allWorkouts.map((w) => ({
        id: w._id,
        name: w.name,
    }));
    const prompt = `
    You are an AI that creates structured workout plans. Below is a list of available workouts:
    ${JSON.stringify(availableWorkouts)}

**workouts array must have exactly ${String(Number(workoutData.duration) + 15)} workoutId**

    Create a workout plan with:
    - Plan Name: "${workoutData.name}"
    - Duration: ${workoutData.duration} days
    - Workouts must be selected only from the provided list.
    - **workouts array must have exactly ${String(Number(workoutData.duration) + 15)} workoutId**.
    - Workouts can be repeated, but diversity is preferred.
    - Return **only** a valid JSON object, without any extra text.

    Example Response:
    {
      "workouts": ["id1", "id2", "id3", "id4", ..., "idN"]
    }
  `;
    const workoutsResponse = yield (0, getGeminiResponse_1.getGeminiResponse)(prompt);
    const json = yield (0, getJson_1.getJson)(workoutsResponse);
    if (((_a = json === null || json === void 0 ? void 0 : json.workouts) === null || _a === void 0 ? void 0 : _a.length) > workoutData.duration) {
        console.log(json === null || json === void 0 ? void 0 : json.workouts.slice(0, workoutData.duration));
        json.workouts = json === null || json === void 0 ? void 0 : json.workouts.slice(0, workoutData.duration);
    }
    if (!json ||
        !Array.isArray(json.workouts) ||
        json.workouts.length !== workoutData.duration) {
        throw new AppError_1.default(500, `Invalid workout plan: Expected ${workoutData.duration} workouts, got ${((_b = json === null || json === void 0 ? void 0 : json.workouts) === null || _b === void 0 ? void 0 : _b.length) || 0}`);
    }
    const data = Object.assign(Object.assign({}, json), workoutData);
    const workout = yield workoutPlan_model_1.WorkoutPlan.create(data);
    if (!workout) {
        (0, unlinkFiles_1.default)(data.image);
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
    const { isDeleted, duration, page = 1, limit = 15 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    // Step 1: Build query filter
    const filter = { isDeleted };
    if (duration) {
        filter.duration = duration;
    }
    // Step 2: Get total count for pagination
    const total = yield workoutPlan_model_1.WorkoutPlan.countDocuments(filter);
    const totalPage = Math.ceil(total / Number(limit));
    // Step 3: Fetch paginated workout plans with populated exercises
    const workoutPlans = yield workoutPlan_model_1.WorkoutPlan.find(filter)
        .populate({
        path: "workouts",
        populate: "exercises",
    })
        .skip(skip)
        .limit(Number(limit));
    // Step 4: Check if user is enrolled in each workout plan
    const workoutPlanIds = workoutPlans.map((workout) => workout._id);
    const userWorkoutPlans = yield userWorkoutPlan_model_1.default.find({
        userId,
        workoutPlanId: { $in: workoutPlanIds },
        isCompleted: "InProgress",
    });
    const workoutPlansWithStatus = workoutPlans.map((workoutPlan) => {
        const isEnrolled = userWorkoutPlans.some((userPlan) => userPlan.workoutPlanId.toString() === workoutPlan._id.toString());
        return Object.assign(Object.assign({}, workoutPlan.toObject()), { isEnrolled });
    });
    return {
        meta: { limit: Number(limit), page: Number(page), total, totalPage },
        data: workoutPlansWithStatus,
    };
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
