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
exports.FriendListService = void 0;
const friendlist_model_1 = __importDefault(require("./friendlist.model"));
const user_model_1 = require("../../user/user.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const blockList_model_1 = require("../blocklist/blockList.model");
const sendRequest = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFriendList = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    });
    if (existingFriendList && existingFriendList.isAccepted == true) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are already friend.");
    }
    if (existingFriendList && !(existingFriendList === null || existingFriendList === void 0 ? void 0 : existingFriendList.isAccepted)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Already sent request");
    }
    const sendRequest = yield friendlist_model_1.default.create({
        senderId: userId,
        receiverId: friendId,
    });
    return sendRequest;
});
const acceteptRequest = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.findOne({
        senderId: friendId,
        receiverId: userId,
    });
    if (!friendList) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Connection not found");
    }
    const acceptUserRequest = yield friendlist_model_1.default.findOneAndUpdate({
        senderId: friendId,
        receiverId: userId,
    }, { isAccepted: true }, { new: true });
    return acceptUserRequest;
});
const removeFriend = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    });
    if (!friendList) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Connection not found");
    }
    yield friendlist_model_1.default.findOneAndDelete({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    });
    return { message: "Removed" };
});
const getFriendList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: true,
    }, { senderId: 1, receiverId: 1 })
        .populate({
        path: "senderId",
        select: "_id email image name",
        options: { lean: true },
    })
        .populate({
        path: "receiverId",
        select: "_id email image name",
        options: { lean: true },
    })
        .lean();
    return friendList.map((friend) => friend.senderId._id.toString() === userId
        ? friend.receiverId
        : friend.senderId);
});
const getPendingList = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingRequests = yield friendlist_model_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: false,
    })
        .populate({
        path: "senderId",
        select: "_id email image name",
        options: { lean: true },
    })
        .populate({
        path: "receiverId",
        select: "_id email image name",
        options: { lean: true },
    })
        .lean();
    if (!type) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "type query missing...");
    }
    if (type === "sendRequestList") {
        return {
            sendRequestList: pendingRequests
                .filter((req) => req.senderId._id.toString() === userId)
                .map((req) => req.senderId._id.toString() === userId ? req.receiverId : req.senderId),
        };
    }
    if (type === "requestedList") {
        return {
            requestedList: pendingRequests
                .filter((req) => req.receiverId._id.toString() === userId)
                .map((req) => req.senderId._id.toString() === userId ? req.receiverId : req.senderId),
        };
    }
});
const suggestedFriend = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userFriends = yield friendlist_model_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
    });
    // Get friend IDs
    const friendIds = userFriends.map((friend) => {
        return friend.senderId.toString() === userId
            ? friend.receiverId
            : friend.senderId;
    });
    // Exclude friends and blocked users from suggestion
    const blockedUsers = yield blockList_model_1.Block.findOne({ userId });
    const blockedUserIds = blockedUsers ? blockedUsers.blockedUser : [];
    // Find other users who are not friends or blocked
    const suggestedUsers = yield user_model_1.User.find({
        _id: { $ne: userId, $nin: [...friendIds, ...blockedUserIds] },
        role: "USER",
    }).select("_id email image name");
    return suggestedUsers;
});
exports.FriendListService = {
    sendRequest,
    removeFriend,
    getFriendList,
    suggestedFriend,
    acceteptRequest,
    getPendingList,
};
