"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseRoute = void 0;
const express_1 = require("express");
const exercise_controller_1 = require("./exercise.controller");
const parseDataMiddleware_1 = require("../../../middleware/parseDataMiddleware");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../../middleware/validator"));
const fileUploadHandler_1 = __importDefault(require("../../../middleware/fileUploadHandler"));
const exercise_validation_1 = require("./exercise.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(exercise_validation_1.zodExerciseSchema), exercise_controller_1.WorkoutController.createExercise);
router.get("/", (0, auth_1.default)("ADMIN", "USER"), exercise_controller_1.WorkoutController.getAllExercise); //
router.get("/:id", (0, auth_1.default)("ADMIN", "USER"), exercise_controller_1.WorkoutController.getExerciseById);
router.patch("/:id", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), exercise_controller_1.WorkoutController.updateExercise);
router.delete("/:id", (0, auth_1.default)("ADMIN"), exercise_controller_1.WorkoutController.deleteExercise);
exports.default = router;
exports.ExerciseRoute = router;
