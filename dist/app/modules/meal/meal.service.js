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
exports.MealService = exports.updateMeal = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../utils/unlinkFiles"));
const meal_model_1 = __importDefault(require("./meal.model"));
const http_status_1 = __importDefault(require("http-status"));
const createMeal = (mealData) => __awaiter(void 0, void 0, void 0, function* () {
    const newMeal = yield meal_model_1.default.create(mealData);
    return newMeal;
});
const updateMeal = (mealId, updateFields) => __awaiter(void 0, void 0, void 0, function* () {
    const isMealExist = yield meal_model_1.default.findOne({ _id: mealId });
    if (!isMealExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found.");
    }
    const updateObject = {};
    for (const [key, value] of Object.entries(updateFields)) {
        if (key.startsWith("nutritionalInfo.")) {
            updateObject[key] = value;
        }
        else {
            updateObject[key] = value;
        }
    }
    (0, unlinkFiles_1.default)(isMealExist === null || isMealExist === void 0 ? void 0 : isMealExist.image);
    const updatedMeal = yield meal_model_1.default.findByIdAndUpdate(mealId, { $set: updateObject }, { new: true });
    if (!updatedMeal) {
        throw new Error("Meal not found");
    }
    return updatedMeal;
});
exports.updateMeal = updateMeal;
const getAllMeals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    const meals = yield meal_model_1.default.find(Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } }));
    return meals;
});
const getSingleMeal = (mealId) => __awaiter(void 0, void 0, void 0, function* () {
    const meal = yield meal_model_1.default.findById(mealId);
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    if (meal.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal deleted");
    }
    return meal;
});
const deleteMeal = (mealId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMeal = yield meal_model_1.default.findByIdAndUpdate(mealId, { $set: { isDeleted: true } }, { new: true });
    if (!deletedMeal) {
        throw new Error("Meal not found");
    }
    return { message: "Meal deleted." };
});
exports.MealService = {
    updateMeal: exports.updateMeal,
    createMeal,
    getAllMeals,
    getSingleMeal,
    deleteMeal,
};
