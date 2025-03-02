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
exports.ChatController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("./chat.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mongoose_1 = require("mongoose");
// Create a new chat message
const createChat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.params;
    const receiverId = new mongoose_1.Types.ObjectId(friendId);
    const { userId: senderId } = req.user;
    const { message } = req.body;
    const result = yield chat_service_1.ChatService.createChat({
        senderId,
        receiverId,
        message,
        seenBy: [],
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Chat message created successfully.",
    });
}));
// Get all chat messages between two users
const getChatsBetweenUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { friendId } = req.params;
    const { page = 1, limit = 30 } = req.query;
    const result = yield chat_service_1.ChatService.getChatsBetweenUsers(userId, friendId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: {
            userChat: result.userChat,
            userFriendShipStatus: result.userFriendShipStatus,
        },
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Chat messages fetched successfully.",
    });
}));
const chatWithFitbot = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    const result = yield chat_service_1.ChatService.chatWithFitBot(prompt);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ai Response fetched successfully.",
    });
}));
// Group all controller functions into an object
exports.ChatController = {
    createChat,
    getChatsBetweenUsers,
    chatWithFitbot,
};
