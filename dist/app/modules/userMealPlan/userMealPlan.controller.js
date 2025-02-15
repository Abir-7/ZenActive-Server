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
exports.UserMealPlanController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const userMealPlan_service_1 = require("./userMealPlan.service");
const createUserMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const mealPlan = yield userMealPlan_service_1.UserMealPlanService.createUserMealPlan(userId, req.body.mealId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User meal plan created successfully",
        data: mealPlan,
    });
}));
const getUserMealPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const mealPlans = yield userMealPlan_service_1.UserMealPlanService.getUserMealPlans(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User meal plans fetched successfully",
        data: mealPlans,
    });
}));
// export const getUserMealPlanById = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const mealPlan = await UserMealPlanService.getUserMealPlanById(id);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "User meal plan fetched successfully",
//       data: mealPlan,
//     });
//   }
// );
const updateUserMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.user;
    const mealPlan = yield userMealPlan_service_1.UserMealPlanService.updateUserMealPlan(userId, (_a = req.params) === null || _a === void 0 ? void 0 : _a.mealId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User meal plan updated successfully",
        data: mealPlan,
    });
}));
const deleteUserMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userMealPlan_service_1.UserMealPlanService.deleteUserMealPlan(req.params.id, req.user.userId);
    (0, sendResponse_1.default)(res, {
        data: { message: "Meal plans deleted" },
        statusCode: 200,
        success: true,
        message: "User meal plan deleted successfully",
    });
}));
exports.UserMealPlanController = {
    createUserMealPlan,
    getUserMealPlans,
    updateUserMealPlan,
    deleteUserMealPlan,
};
