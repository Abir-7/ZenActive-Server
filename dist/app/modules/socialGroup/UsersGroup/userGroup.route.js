"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroupRoute = void 0;
const express_1 = require("express");
const userGroup_controller_1 = require("./userGroup.controller");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const router = (0, express_1.Router)();
router.get("/all-user-group", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.getUserAllGroups);
router.get("/invite-user-list/:groupId", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.inviteUserList);
router.post("/invite-user", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.inviteUser);
router.patch("/join/:groupId", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.addUserToGroup);
router.patch("/:groupId/remove/:userId", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.removeUserFromGroup);
router.patch("/leave/:groupId", (0, auth_1.default)("USER"), userGroup_controller_1.UserGroupController.leaveFromGroup);
exports.UserGroupRoute = router;
