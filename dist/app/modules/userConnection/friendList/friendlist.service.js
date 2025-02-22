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
const user_model_1 = require("../../user/user.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// import { Block } from "../blocklist/blockList.model";
const friendlist_model_1 = __importDefault(require("./friendlist.model"));
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
const getFriendList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: true,
        status: null,
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
    console.log(userId, type);
    const pendingRequests = yield friendlist_model_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: false,
        status: null,
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
const suggestedFriend = (myUserId, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find all users who are in a relationship with you (either as sender or receiver)
    const relationships = yield friendlist_model_1.default.find({
        $or: [{ senderId: myUserId }, { receiverId: myUserId }],
    });
    // Extract the user IDs from the relationships
    const relatedUserIds = relationships.map((rel) => rel.senderId.toString() === myUserId
        ? rel.receiverId.toString()
        : rel.senderId.toString());
    // Add your own ID to the relatedUserIds array
    relatedUserIds.push(myUserId);
    const query = {
        _id: { $nin: relatedUserIds },
        role: "USER",
    };
    // Add the email condition if an email is provided
    if (email) {
        query.email = { $regex: email, $options: "i" }; // Case-insensitive search by email
    }
    // Step 2: Find all users who are not in the relatedUserIds list
    const suggestedFriends = yield user_model_1.User.find(query);
    return suggestedFriends;
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
    yield friendlist_model_1.default.findOneAndUpdate({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    }, { status: "unfriend", statusChangeBy: userId, isAccepted: false }, { new: true });
    return { message: "User Unfriend." };
});
const addToBlock = (friendId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    });
    if (!friendList) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Connection not found");
    }
    yield friendlist_model_1.default.findOneAndUpdate({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    }, { status: "blocked", statusChangeBy: userId, isAccepted: false }, { new: true });
    return { message: "User Blocked" };
});
const removeRequest = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
        isAccepted: false,
    });
    if (!friendList) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Connection not found");
    }
    yield friendlist_model_1.default.findOneAndDelete({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
        isAccepted: false,
    });
    return { message: "User Request Deleted" };
});
function getFriendListWithLastMessage(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendListWithMessages = yield friendlist_model_1.default.aggregate([
            {
                $match: {
                    $or: [{ senderId: userId }, { receiverId: userId }],
                    isAccepted: true,
                },
            },
            {
                $lookup: {
                    from: "users", // Assuming 'users' is the collection name for the User model
                    let: { senderId: "$senderId", receiverId: "$receiverId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: ["$_id", "$$senderId"] },
                                        { $eq: ["$_id", "$$receiverId"] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                image: 1,
                                _id: 1,
                            },
                        },
                    ],
                    as: "friendDetails",
                },
            },
            {
                $unwind: {
                    path: "$friendDetails",
                },
            },
            {
                $lookup: {
                    from: "chats",
                    let: { senderId: "$senderId", receiverId: "$receiverId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ["$senderId", "$$senderId"] },
                                                { $eq: ["$receiverId", "$$receiverId"] },
                                            ],
                                        },
                                        {
                                            $and: [
                                                { $eq: ["$senderId", "$$receiverId"] },
                                                { $eq: ["$receiverId", "$$senderId"] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $sort: { createdAt: -1 } }, // Sort messages by most recent
                        { $limit: 1 }, // Get only the latest message
                    ],
                    as: "lastMessage",
                },
            },
            {
                $unwind: {
                    path: "$lastMessage",
                    preserveNullAndEmptyArrays: true, // Include friends even if there's no message
                },
            },
            {
                $project: {
                    friendDetails: 1,
                    lastMessage: 1,
                },
            },
            {
                $match: {
                    lastMessage: { $ne: null }, // Exclude friends with no messages
                    "friendDetails._id": { $ne: userId }, // Exclude the user from the friend list
                },
            },
            {
                $sort: {
                    "lastMessage.createdAt": -1, // Sort by the last message's createdAt time in descending order
                },
            },
        ]);
        return friendListWithMessages;
    });
}
exports.FriendListService = {
    sendRequest,
    removeFriend,
    getFriendList,
    suggestedFriend,
    acceteptRequest,
    getPendingList,
    addToBlock,
    removeRequest,
    getFriendListWithLastMessage,
};
