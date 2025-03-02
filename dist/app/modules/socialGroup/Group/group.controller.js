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
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const group_service_1 = require("./group.service");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
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
const getAllGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { searchTerm, page = 1, limit = 25 } = req.query;
    const result = yield group_service_1.GroupService.getAllGroup(userId, searchTerm, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All Public Group fetched successfully.",
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
const getSingleGroupData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { userId } = req.user;
    const result = yield group_service_1.GroupService.getSingleGroupData(groupId, userId);
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
    deleteGroup,
    getSingleGroupData,
    getAllGroup,
};
