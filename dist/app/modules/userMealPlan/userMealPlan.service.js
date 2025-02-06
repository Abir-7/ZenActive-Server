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
exports.UserMealPlanService = void 0;
const userMealPlan_model_1 = __importDefault(require("./userMealPlan.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const meal_model_1 = __importDefault(require("../meal/meal.model"));
const appdata_model_1 = require("../userAppData/appdata.model");
const createUserMealPlan = (userId, mealId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield meal_model_1.default.findById(mealId);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    return yield userMealPlan_model_1.default.create({ mealId, userId });
});
const getUserMealPlans = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userMealPlan_model_1.default.find({ userId }).populate("mealId");
});
// export const getUserMealPlanById = async (userid: string) => {
//   return await UserMealPlan.findById(id).populate("mealId userId");
// };
const updateUserMealPlan = (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updatedUserMealPlan = yield userMealPlan_model_1.default.findOneAndUpdate({ _id: id, userId }, { isCompleted: true }, { new: true }).populate("mealId");
    if (!updatedUserMealPlan) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "UserMealPlan not found");
    }
    const userAppData = yield appdata_model_1.UserAppData.findOne({ userId });
    if (!userAppData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User App data not found");
    }
    yield appdata_model_1.UserAppData.findOneAndUpdate({ userId }, {
        gainedCalories: ((_b = (_a = updatedUserMealPlan.mealId) === null || _a === void 0 ? void 0 : _a.nutritionalInfo) === null || _b === void 0 ? void 0 : _b.calories) +
            (userAppData === null || userAppData === void 0 ? void 0 : userAppData.gainedCalories),
    });
    return updatedUserMealPlan;
});
const deleteUserMealPlan = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userMealPlan_model_1.default.findOneAndDelete({ _id: id, userId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Delete Failed");
    }
    return { message: "Meal plan deleted." };
});
exports.UserMealPlanService = {
    createUserMealPlan,
    getUserMealPlans,
    updateUserMealPlan,
    deleteUserMealPlan,
};
