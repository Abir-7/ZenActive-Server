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
exports.UserWorkoutPlanController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userWorkoutPlan_service_1 = require("./userWorkoutPlan.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Start a new workout plan for a user
const startWorkoutPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { workoutPlanId } = req.body;
    const result = yield userWorkoutPlan_service_1.UserWorkoutPlanService.startWorkoutPlan(userId, workoutPlanId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Workout plan started successfully.",
    });
}));
// Update the present workout in a user's workout plan
const updatePresentWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId } = req.params;
    const { userId } = req.user;
    const result = yield userWorkoutPlan_service_1.UserWorkoutPlanService.updatePresentWorkout(userId, planId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Present workout updated successfully.",
    });
}));
// Get a user's active workout plan
const getActiveWorkoutPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId } = req.params;
    const { userId } = req.user;
    const result = yield userWorkoutPlan_service_1.UserWorkoutPlanService.getActiveWorkoutPlan(userId, planId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Active workout plan fetched successfully.",
    });
}));
exports.UserWorkoutPlanController = {
    startWorkoutPlan,
    updatePresentWorkout,
    getActiveWorkoutPlan,
};
