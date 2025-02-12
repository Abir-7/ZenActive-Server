"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyExerciseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dailyExercise_controller_1 = require("./dailyExercise.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("USER"), dailyExercise_controller_1.DailyExerciseController.createDailyExercise);
router.get("/:id", (0, auth_1.default)("USER"), dailyExercise_controller_1.DailyExerciseController.getDailyExerciseById);
exports.DailyExerciseRoutes = router;
