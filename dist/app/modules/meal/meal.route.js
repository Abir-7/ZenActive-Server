"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRoute = void 0;
const express_1 = require("express");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const meal_controller_1 = require("./meal.controller");
const parseDataMiddleware_1 = require("../../middleware/parseDataMiddleware");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../middleware/validator"));
const meal_validation_1 = require("./meal.validation");
const router = (0, express_1.Router)();
router.post("/create-meal", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(meal_validation_1.zodMealSchema), meal_controller_1.MealController.createMeal);
router.patch("/:id", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(meal_validation_1.zodUpdateMealSchema), meal_controller_1.MealController.updateMeal);
router.delete("/:id", (0, auth_1.default)("ADMIN"), meal_controller_1.MealController.deleteMeal);
router.get("/", (0, auth_1.default)("ADMIN", "USER"), meal_controller_1.MealController.getAllMeals);
router.get("/user-food-list", (0, auth_1.default)("ADMIN", "USER"), meal_controller_1.MealController.getAllUserMeals);
router.get("/:id", (0, auth_1.default)("ADMIN", "USER"), meal_controller_1.MealController.getSingleMeal);
exports.MealRoute = router;
