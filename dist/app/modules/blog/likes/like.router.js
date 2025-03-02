"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const like_controller_1 = require("./like.controller");
const validator_1 = __importDefault(require("../../../middleware/validator"));
const like_validation_1 = require("./like.validation");
const router = (0, express_1.Router)();
router.post("/toggle-like", (0, auth_1.default)("USER"), (0, validator_1.default)(like_validation_1.zodLikeSchema), like_controller_1.LikeController.toggleLike);
exports.LikeRoute = router;
