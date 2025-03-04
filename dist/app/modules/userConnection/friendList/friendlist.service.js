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
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../../user/user.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// import { Block } from "../blocklist/blockList.model";
const friendlist_model_1 = __importDefault(require("./friendlist.model"));
const notification_model_1 = require("../../notification/notification.model");
const notification_interface_1 = require("../../notification/notification.interface");
const handleNotification_1 = require("../../../socket/notification/handleNotification");
const chat_model_1 = require("../../userChat/chat.model");
const sendRequest = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const senderData = yield user_model_1.User.findById(userId).select("name");
    console.log(senderData);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingFriendList = yield friendlist_model_1.default.findOne({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId },
            ],
        }).session(session);
        if (existingFriendList) {
            if (existingFriendList.isAccepted) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are already friends.");
            }
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Already sent request");
        }
        yield notification_model_1.Notification.create([
            {
                senderId: userId,
                receiverId: friendId,
                type: notification_interface_1.NotificationType.FRIEND_REQUEST,
                message: `\`${((_a = senderData === null || senderData === void 0 ? void 0 : senderData.name) === null || _a === void 0 ? void 0 : _a.firstName) +
                    (((_b = senderData === null || senderData === void 0 ? void 0 : senderData.name) === null || _b === void 0 ? void 0 : _b.lastName) ? " " + senderData.name.lastName : "")}\` sent you a friend requiest.`,
            },
        ], { session });
        (0, handleNotification_1.handleNotification)("You have a new friend request", String(friendId));
        const sendRequest = yield friendlist_model_1.default.create([{ senderId: userId, receiverId: friendId }], { session });
        yield session.commitTransaction();
        session.endSession();
        return sendRequest[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
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
const getFriendList = (userId_1, searchText_1, ...args_1) => __awaiter(void 0, [userId_1, searchText_1, ...args_1], void 0, function* (userId, searchText, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
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
        .skip(skip) // Apply pagination at the database level
        .limit(limit)
        .lean();
    // Extract only the friend data
    let friends = friendList.map((friend) => friend.senderId._id.toString() === userId
        ? friend.receiverId
        : friend.senderId);
    // 🔍 Search by full name (case-insensitive)
    if (searchText) {
        const searchRegex = new RegExp(searchText, "i"); // Case-insensitive search
        friends = friends.filter((friend) => {
            var _a, _b;
            const fullName = `${(_a = friend.name) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = friend === null || friend === void 0 ? void 0 : friend.name) === null || _b === void 0 ? void 0 : _b.lastName}`;
            return searchRegex.test(fullName);
        });
    }
    // Get total count for pagination
    const total = friends.length;
    const totalPage = Math.ceil(total / limit);
    // Apply pagination
    const paginatedFriends = friends.slice(skip, skip + limit);
    return {
        meta: { limit, page, total, totalPage },
        data: paginatedFriends,
    };
});
const getPendingList = (userId_1, type_1, ...args_1) => __awaiter(void 0, [userId_1, type_1, ...args_1], void 0, function* (userId, type, page = 1, limit = 30) {
    if (!type) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "type query missing...");
    }
    const skip = (page - 1) * limit;
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
    let filteredList = [];
    if (type === "sendRequestList") {
        filteredList = pendingRequests
            .filter((req) => req.senderId._id.toString() === userId)
            .map((req) => req.senderId._id.toString() === userId ? req.receiverId : req.senderId);
    }
    else if (type === "requestedList") {
        filteredList = pendingRequests
            .filter((req) => req.receiverId._id.toString() === userId)
            .map((req) => req.senderId._id.toString() === userId ? req.receiverId : req.senderId);
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid type query...");
    }
    // Get total count for pagination
    const total = filteredList.length;
    const totalPage = Math.ceil(total / limit);
    // Apply pagination
    const paginatedList = filteredList.slice(skip, skip + limit);
    return {
        meta: { limit, page, total, totalPage },
        data: paginatedList,
    };
});
const suggestedFriend = (myUserId_1, email_1, ...args_1) => __awaiter(void 0, [myUserId_1, email_1, ...args_1], void 0, function* (myUserId, email, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
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
    // Step 2: Get total count for pagination
    const total = yield user_model_1.User.countDocuments(query);
    const totalPage = Math.ceil(total / limit);
    // Step 3: Find all users who are not in the relatedUserIds list
    const suggestedFriends = yield user_model_1.User.find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    return {
        meta: { limit, page, total, totalPage },
        data: suggestedFriends,
    };
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
const getFriendListWithLastMessage = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    try {
        // Step 1: Fetch all connections where the user is either the sender or receiver and isAccepted is true
        const connections = yield friendlist_model_1.default.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            isAccepted: true,
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        // Step 2: For each connection, find the last message in the IChat collection and fetch friend details
        const friendsWithLastMessage = yield Promise.all(connections.map((connection) => __awaiter(void 0, void 0, void 0, function* () {
            const friendId = connection.senderId.toString() === userId.toString()
                ? connection.receiverId
                : connection.senderId;
            // Find the last message between the user and the friend
            const lastMessage = yield chat_model_1.Chat.findOne({
                $or: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
            })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the last message
                .exec();
            // Fetch friend details
            const friendDetails = yield user_model_1.User.findById(friendId)
                .select("name email image _id")
                .exec();
            return {
                friendId,
                friendDetails: friendDetails
                    ? {
                        name: friendDetails.name,
                        email: friendDetails.email,
                        image: friendDetails.image,
                        _id: friendDetails._id,
                    }
                    : null,
                lastMessage: lastMessage ? lastMessage.message : null,
            };
        })));
        // Step 3: Get total count for pagination metadata
        const totalConnections = yield friendlist_model_1.default.countDocuments({
            $or: [{ senderId: userId }, { receiverId: userId }],
            isAccepted: true,
        });
        return {
            data: friendsWithLastMessage,
            meta: {
                total: totalConnections,
                page,
                limit,
                totalPages: Math.ceil(totalConnections / limit),
            },
        };
    }
    catch (error) {
        console.error("Error fetching friend list with last message:", error);
        throw error;
    }
});
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
