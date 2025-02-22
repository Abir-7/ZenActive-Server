"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const appdata_controller_1 = require("./appdata.controller");
const router = (0, express_1.Router)();
router.post("/add-point", (0, auth_1.default)("USER"), appdata_controller_1.AppDataController.addPoints);
router.post("/add-workout-time", (0, auth_1.default)("USER"), appdata_controller_1.AppDataController.addWorkoutTime);
exports.AppDataRoute = router;
