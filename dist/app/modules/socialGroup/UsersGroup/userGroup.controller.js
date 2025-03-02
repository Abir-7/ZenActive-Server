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
exports.UserGroupController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const userGroup_service_1 = require("./userGroup.service");
const getUserAllGroups = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("object");
    const { userId } = req.user;
    const { page = 1, limit = 25, searchTerm } = req.query;
    const result = yield userGroup_service_1.UserGroupService.getUserAllGroups(userId, searchTerm, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Groups fetched successfully.",
    });
}));
const addUserToGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { groupId } = req.params;
    const result = yield userGroup_service_1.UserGroupService.addUserToGroup(groupId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User added to group successfully.",
    });
}));
const removeUserFromGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, userId } = req.params;
    const { userId: adminId } = req.user;
    const result = yield userGroup_service_1.UserGroupService.removeUserFromGroup(groupId, userId, adminId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User removed from group successfully.",
    });
}));
const leaveFromGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { userId } = req.user;
    const result = yield userGroup_service_1.UserGroupService.leaveFromGroup(groupId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User leaved from group successfully.",
    });
}));
const inviteUserList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { userId } = req.user;
    const { searchTerm, page = 1, limit = 20 } = req.query;
    const result = yield userGroup_service_1.UserGroupService.inviteUserList(groupId, userId, searchTerm, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User list for invite is fetched successfully.",
    });
}));
const inviteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, receiverId } = req.body;
    const { userId } = req.user;
    const result = yield userGroup_service_1.UserGroupService.inviteUser(groupId, userId, receiverId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Group invite send to user successfully.",
    });
}));
exports.UserGroupController = {
    getUserAllGroups,
    addUserToGroup,
    removeUserFromGroup,
    leaveFromGroup,
    inviteUserList,
    inviteUser,
};
