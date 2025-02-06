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
exports.BlockController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const blockList_service_1 = require("./blockList.service");
const addToBlock = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockedUserkId } = req.body;
    const userId = req.user.userId;
    const result = yield blockList_service_1.BlockService.addToBlock(blockedUserkId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User has been successfully added to the blocklist.",
    });
}));
const deleteFromBlock = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockedUserkId } = req.body;
    const userId = req.user.userId;
    const result = yield blockList_service_1.BlockService.deleteFromBlock(blockedUserkId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User has been successfully removed from the blocklist.",
    });
}));
const getBlockList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const friendList = yield blockList_service_1.BlockService.getBlockList(userId);
    (0, sendResponse_1.default)(res, {
        data: friendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Block list fetched successfully.",
    });
}));
exports.BlockController = {
    deleteFromBlock,
    addToBlock,
    getBlockList,
};
