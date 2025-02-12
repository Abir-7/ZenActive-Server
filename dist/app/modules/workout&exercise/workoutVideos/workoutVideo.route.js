"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutVideoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const workoutVideo_controller_1 = require("./workoutVideo.controller");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const fileUploadHandler_1 = __importDefault(require("../../../middleware/fileUploadHandler"));
const parseDataMiddleware_1 = require("../../../middleware/parseDataMiddleware");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("ADMIN", "USER"), workoutVideo_controller_1.WorkoutVideoController.getAllWorkoutVideos);
router.post("/", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), workoutVideo_controller_1.WorkoutVideoController.createWorkoutVideo);
router.patch("/:id", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), workoutVideo_controller_1.WorkoutVideoController.updateWorkoutVideo);
router.delete("/:id", (0, auth_1.default)("ADMIN"), workoutVideo_controller_1.WorkoutVideoController.deleteWorkoutVideo);
exports.WorkoutVideoRoutes = router;
