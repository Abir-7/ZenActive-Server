"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadgeRoute = void 0;
const express_1 = require("express");
const userBadge_controller_1 = require("./userBadge.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("USER"), userBadge_controller_1.UserBadgeController.createOrUpdateUserBadge);
router.get("/get-user-badge", (0, auth_1.default)("USER"), userBadge_controller_1.UserBadgeController.getUserBadgeById);
exports.UserBadgeRoute = router;
