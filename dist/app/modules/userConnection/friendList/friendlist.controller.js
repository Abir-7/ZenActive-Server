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
exports.FriendListController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const friendlist_service_1 = require("./friendlist.service");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
// Add a friend to the user's friend list
const addFriend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user.userId;
    const updatedFriendList = yield friendlist_service_1.FriendListService.sendRequest(userId, friendId);
    (0, sendResponse_1.default)(res, {
        data: updatedFriendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Request sent successfully.",
    });
}));
const acceteptRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user.userId;
    const updatedFriendList = yield friendlist_service_1.FriendListService.acceteptRequest(userId, friendId);
    (0, sendResponse_1.default)(res, {
        data: updatedFriendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Request accepted successfully.",
    });
}));
const removeFriend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user.userId;
    const updatedFriendList = yield friendlist_service_1.FriendListService.removeFriend(userId, friendId);
    (0, sendResponse_1.default)(res, {
        data: updatedFriendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Removed successfully.",
    });
}));
const getFriendList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const friendList = yield friendlist_service_1.FriendListService.getFriendList(userId);
    (0, sendResponse_1.default)(res, {
        data: friendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Friend list fetched successfully.",
    });
}));
const getPendingList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query;
    const userId = req.user.userId;
    const friendList = yield friendlist_service_1.FriendListService.getPendingList(userId, type);
    (0, sendResponse_1.default)(res, {
        data: friendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Sugested Friend list fetched successfully.",
    });
}));
const getSugestedFriend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const friendList = yield friendlist_service_1.FriendListService.suggestedFriend(userId);
    (0, sendResponse_1.default)(res, {
        data: friendList,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Sugested Friend list fetched successfully.",
    });
}));
exports.FriendListController = {
    addFriend,
    removeFriend,
    getFriendList,
    getSugestedFriend,
    acceteptRequest,
    getPendingList,
};
