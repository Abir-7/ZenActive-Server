"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMealPlanRoute = void 0;
const express_1 = __importDefault(require("express"));
const userMealPlan_controller_1 = require("./userMealPlan.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("USER"), userMealPlan_controller_1.UserMealPlanController.createUserMealPlan);
router.get("/", (0, auth_1.default)("USER"), userMealPlan_controller_1.UserMealPlanController.getUserMealPlans);
// router.get("/details/:id", UserMealPlanController.getUserMealPlanById);
router.patch("/:mealId", (0, auth_1.default)("USER"), userMealPlan_controller_1.UserMealPlanController.updateUserMealPlan);
router.delete("/:id", (0, auth_1.default)("USER"), userMealPlan_controller_1.UserMealPlanController.deleteUserMealPlan);
exports.UserMealPlanRoute = router;
