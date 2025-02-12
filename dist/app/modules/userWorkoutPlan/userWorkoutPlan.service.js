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
exports.UserWorkoutPlanService = void 0;
const userWorkoutPlan_model_1 = __importDefault(require("./userWorkoutPlan.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const workoutPlan_model_1 = require("../workout&exercise/workoutPlan/workoutPlan.model");
const workout_model_1 = __importDefault(require("../workout&exercise/workout/workout.model"));
const appdata_model_1 = require("../userAppData/appdata.model");
const http_status_1 = __importDefault(require("http-status"));
const startWorkoutPlan = (userId, workoutPlanId) => __awaiter(void 0, void 0, void 0, function* () {
    const workoutPlan = yield workoutPlan_model_1.WorkoutPlan.findOne({
        _id: workoutPlanId,
    }).populate({
        path: "workouts",
        populate: {
            path: "exercises",
            model: "Exercise",
        },
    });
    if (!workoutPlan) {
        throw new AppError_1.default(404, "Workout plan not found.");
    }
    const plans = {
        userId,
        workoutPlanId,
        currentWorkoutIndex: 0,
        currentExerciseIndex: 0,
        isCompleted: "InProgress",
        startedAt: Date.now(),
        endAt: new Date(Date.now() + workoutPlan.duration * 7 * 24 * 60 * 60 * 1000),
    };
    const isExist = yield userWorkoutPlan_model_1.default.findOne({
        workoutPlanId,
        isCompleted: "InProgress",
    });
    if (isExist) {
        throw new AppError_1.default(404, `Workout plan currently in ${isExist.isCompleted}.`);
    }
    const userWorkoutPlan = yield userWorkoutPlan_model_1.default.create(plans);
    return userWorkoutPlan;
});
// Update the present workout in a user's workout plan
const updatePresentWorkout = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield userWorkoutPlan_model_1.default.findOne({
        userId,
        workoutPlanId: planId,
    });
    if (!progress) {
        throw new Error("User progress not found");
    }
    const { currentWorkoutIndex, currentExerciseIndex } = progress;
    const plan = yield workoutPlan_model_1.WorkoutPlan.findById(planId).populate({
        path: "workouts",
        populate: {
            path: "exercises",
            model: "Exercise",
        },
    }); // Fetch the workout plan
    if (!plan) {
        throw new Error("Workout plan not found");
    }
    const currentWorkout = plan.workouts[currentWorkoutIndex];
    if (!currentWorkout) {
        throw new Error("CurrentWorkout Workout not found");
    }
    const workout = yield workout_model_1.default.findById(currentWorkout._id);
    if (!workout) {
        throw new Error("Workout not found");
    }
    // const currentExercise = workout.exercises[currentExerciseIndex];
    progress.completedExercises.push({
        workoutIndex: currentWorkoutIndex,
        exerciseIndex: currentExerciseIndex,
        completedAt: new Date(),
    });
    const appData = yield appdata_model_1.UserAppData.findOne({
        userId: userId,
    });
    if (!appData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Appdata  not found.");
    }
    if (currentExerciseIndex + 1 < workout.exercises.length) {
        // If there are more exercises in the current workout
        progress.currentExerciseIndex += 1;
    }
    else {
        // Move to the next workout
        appData.points = (appData.points ? appData.points : 0) + workout.points;
        yield appData.save();
        if (currentWorkoutIndex + 1 < plan.workouts.length) {
            progress.currentWorkoutIndex += 1;
            progress.currentExerciseIndex = 0; // Reset to the first exercise of the next workout
        }
        else {
            // If all workouts are completed, mark the plan as completed
            appData.points = ((appData === null || appData === void 0 ? void 0 : appData.points) ? appData.points : 0) + (plan === null || plan === void 0 ? void 0 : plan.points);
            yield appData.save();
            progress.isCompleted = "Completed";
            progress.endAt = new Date(Date.now());
        }
    }
    yield progress.save();
    return progress;
});
// Increment the number of workouts done
// Get a user's active workout plan
const getActiveWorkoutPlan = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, planId);
    const data = yield userWorkoutPlan_model_1.default.findOne({
        workoutPlanId: planId,
        userId,
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
    // console.log(
    //   (data?.workoutPlanId as IWorkoutPlan).workouts.slice(
    //     data?.currentWorkoutIndex as number,
    //     (data?.currentWorkoutIndex as number) + 1
    //   ),
    //   "gg"
    // );
    return data;
    // return {
    //   ...data,
    //   workoutPlanId: (data?.workoutPlanId as IWorkoutPlan).workouts.slice(
    //     data?.currentWorkoutIndex as number,
    //     (data?.currentWorkoutIndex as number) + 1
    //   ),
    // };
});
const giveFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () { });
exports.UserWorkoutPlanService = {
    startWorkoutPlan,
    updatePresentWorkout,
    getActiveWorkoutPlan,
};
