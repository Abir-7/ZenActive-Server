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
exports.FeedbackService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const workoutPlan_model_1 = require("../workout&exercise/workoutPlan/workoutPlan.model");
const feedback_model_1 = __importDefault(require("./feedback.model"));
const giveWorkoutPlanFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield workoutPlan_model_1.WorkoutPlan.findById(data.planId);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Workout plan not found.");
    }
    const feedback = yield feedback_model_1.default.create(data);
    return feedback;
});
const getAllWorkoutPlanWithFeedback = () => __awaiter(void 0, void 0, void 0, function* () {
    const workoutPlans = yield workoutPlan_model_1.WorkoutPlan.aggregate([
        {
            $lookup: {
                from: "userworkoutplanfeedbacks", // Collection name in lowercase
                localField: "_id",
                foreignField: "planId",
                as: "feedbacks",
            },
        },
    ]);
    return workoutPlans;
});
exports.FeedbackService = {
    giveWorkoutPlanFeedback,
    getAllWorkoutPlanWithFeedback,
};
