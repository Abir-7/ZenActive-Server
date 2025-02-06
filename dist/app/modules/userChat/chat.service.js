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
const friendlist_model_1 = __importDefault(require("../userConnection/friendList/friendlist.model"));
const chat_model_1 = require("./chat.model");
const createChat = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield friendlist_model_1.default.findOne({
        $or: [
            { senderId: chatData === null || chatData === void 0 ? void 0 : chatData.senderId, receiverId: chatData.receiverId },
            { senderId: chatData.receiverId, receiverId: chatData.senderId },
        ],
    });
    if (!isExist) {
        throw new AppError_1.default(404, "You are not friends.");
    }
    const chat = new chat_model_1.Chat(chatData);
    return yield chat.save();
});
const getChatsBetweenUsers = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_model_1.Chat.find({
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
        ],
    })
        .sort({ createdAt: 1 })
        .exec();
});
exports.ChatService = {
    createChat,
    getChatsBetweenUsers,
};
