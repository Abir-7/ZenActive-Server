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
exports.MealController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const meal_service_1 = require("./meal.service");
const http_status_1 = __importDefault(require("http-status"));
const createMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { image });
    const result = yield meal_service_1.MealService.createMeal(value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meal successfully created.",
    });
}));
const updateMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let image = null;
    let value = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (image) {
        value = Object.assign(Object.assign({}, req.body), { image });
    }
    else {
        value = req.body;
    }
    const result = yield meal_service_1.MealService.updateMeal(id, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meal successfully updated.",
    });
}));
const deleteMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield meal_service_1.MealService.deleteMeal(id);
    console.log(result, "------->");
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meal successfully deleted.",
    });
}));
const getAllMeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query; // You can pass filters here if needed (e.g., { category: 'vegan' })
    const result = yield meal_service_1.MealService.getAllMeals(filter);
    (0, sendResponse_1.default)(res, {
        data: result.allMeals,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meals retrieved successfully.",
    });
}));
const getAllUserMeals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query; // You can pass filters here if needed (e.g., { category: 'vegan' })
    const { userId } = req.user;
    const result = yield meal_service_1.MealService.getAlluserMeals(filter, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meals retrieved successfully.",
    });
}));
const getSingleMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield meal_service_1.MealService.getSingleMeal(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Meal retrieved successfully.",
    });
}));
exports.MealController = {
    updateMeal,
    createMeal,
    deleteMeal,
    getAllMeals,
    getSingleMeal,
    getAllUserMeals,
};
