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
exports.GroupController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const group_service_1 = require("./group.service");
const http_status_1 = __importDefault(require("http-status"));
const createGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const groupData = req.body;
    const result = yield group_service_1.GroupService.createGroup(groupData, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Group created successfully.",
    });
}));
const updateGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = null;
    let value = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (image) {
        value = Object.assign(Object.assign({}, req.body), { image });
    }
    else {
        value = req.body;
    }
    const { groupId } = req.params;
    const { userId } = req.user;
    const result = yield group_service_1.GroupService.updateGroup(groupId, userId, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Group updated successfully.",
    });
}));
const addUserToGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { groupId } = req.params;
    const result = yield group_service_1.GroupService.addUserToGroup(groupId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User added to group successfully.",
    });
}));
const leaveFromGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { userId } = req.user;
    const result = yield group_service_1.GroupService.leaveFromGroup(groupId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User leaved from group successfully.",
    });
}));
const removeUserFromGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, userId } = req.params;
    const { userId: adminId } = req.user;
    const result = yield group_service_1.GroupService.removeUserFromGroup(groupId, userId, adminId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User removed from group successfully.",
    });
}));
const deleteGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { userId } = req.user;
    yield group_service_1.GroupService.deleteGroup(groupId, userId);
    (0, sendResponse_1.default)(res, {
        data: null,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Group deleted successfully.",
    });
}));
const getUserAllGroups = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield group_service_1.GroupService.getUserAllGroups(userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Groups fetched successfully.",
    });
}));
const getSingleGroupData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const result = yield group_service_1.GroupService.getSingleGroupData(groupId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Group data fetched successfully.",
    });
}));
exports.GroupController = {
    createGroup,
    updateGroup,
    addUserToGroup,
    leaveFromGroup,
    removeUserFromGroup,
    deleteGroup,
    getUserAllGroups,
    getSingleGroupData,
};
