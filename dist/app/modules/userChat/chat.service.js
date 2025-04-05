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
exports.ChatService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const friendlist_model_1 = __importDefault(require("../userConnection/friendList/friendlist.model"));
const chat_model_1 = require("./chat.model");
const friendlist_model_2 = __importDefault(require("../userConnection/friendList/friendlist.model"));
const getGeminiResponse_1 = require("../../utils/getGeminiResponse");
const createChat = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const [isSenderExist, isReceiverExist] = yield Promise.all([
        user_model_1.User.findOne({ _id: chatData.senderId }),
        user_model_1.User.findOne({ _id: chatData.receiverId }),
    ]);
    if (!(isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist._id) || !(isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist._id)) {
        throw new AppError_1.default(404, "User not found.");
    }
    const isExist = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: chatData === null || chatData === void 0 ? void 0 : chatData.senderId, receiverId: chatData.receiverId },
            { senderId: chatData.receiverId, receiverId: chatData.senderId },
        ],
        isAccepted: true,
        status: null,
    });
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist.isAccepted)) {
        throw new AppError_1.default(404, "You are not friends.");
    }
    if (!isExist) {
        throw new AppError_1.default(404, "You are not friends.");
    }
    const chat = new chat_model_1.Chat(Object.assign(Object.assign({}, chatData), { seenBy: [chatData.senderId] }));
    yield friendlist_model_2.default.findOneAndUpdate({
        $or: [
            { senderId: chatData.receiverId, receiverId: chatData.senderId },
            { senderId: chatData.senderId, receiverId: chatData.receiverId },
        ],
    }, { lastMessage: chatData.message, updatedAt: Date.now() }, { new: true });
    return yield chat.save();
});
const getChatsBetweenUsers = (userId_1, friendId_1, ...args_1) => __awaiter(void 0, [userId_1, friendId_1, ...args_1], void 0, function* (userId, friendId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [userChat, total] = yield Promise.all([
        chat_model_1.Chat.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId },
            ],
        })
            .sort({ createdAt: 1 }) // Sort by latest messages first
            .skip(skip)
            .limit(limit)
            .populate({
            path: "senderId",
            select: "name email _id image",
        })
            .populate({
            path: "receiverId",
            select: "name email _id image",
        })
            .lean(),
        chat_model_1.Chat.countDocuments({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId },
            ],
        }),
    ]);
    const userFriendShipStatus = yield friendlist_model_2.default.findOne({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    })
        .select("senderId receiverId status isAccepted statusChangeBy")
        .populate({
        path: "statusChangeBy",
        select: "name email _id image",
    })
        .populate({
        path: "senderId",
        select: "name email _id image",
    })
        .populate({
        path: "receiverId",
        select: "name email _id image",
    })
        .lean();
    // Update chats where userId is not in seenBy
    yield chat_model_1.Chat.updateMany({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
        seenBy: { $ne: userId },
    }, { $push: { seenBy: userId } });
    // Create meta data
    const meta = {
        limit,
        page,
        total,
        totalPage: Math.ceil(total / limit),
    };
    const formattedCode = {
        userChat,
        userFriendShipStatus: userFriendShipStatus
            ? {
                senderId: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus.senderId,
                receiverId: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus.receiverId,
                connectionId: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus._id,
                isAccepted: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus.isAccepted,
                status: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus.status,
                statusChangeBy: userFriendShipStatus === null || userFriendShipStatus === void 0 ? void 0 : userFriendShipStatus.statusChangeBy,
            }
            : null,
        meta,
    };
    return formattedCode;
});
const chatWithFitBot = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workoutsResponse = yield (0, getGeminiResponse_1.getGeminiResponse)(prompt);
        // Extract text if the response is structured
        const responseText = typeof workoutsResponse === "string"
            ? workoutsResponse
            : JSON.stringify(workoutsResponse, null, 2); // Convert object to readable text if necessary
        return responseText;
    }
    catch (error) {
        console.error("Error fetching response from Gemini:", error);
        return "Sorry, I couldn't process your request. Please try again.";
    }
});
exports.ChatService = {
    createChat,
    getChatsBetweenUsers,
    chatWithFitBot,
};
