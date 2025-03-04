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
exports.LikeService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const handleNotification_1 = require("../../../socket/notification/handleNotification");
const notification_interface_1 = require("../../notification/notification.interface");
const notification_model_1 = require("../../notification/notification.model");
const user_model_1 = require("../../user/user.model");
const post_model_1 = __importDefault(require("../post/post.model"));
const like_model_1 = __importDefault(require("./like.model"));
const http_status_1 = __importDefault(require("http-status"));
const toggleLike = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const post = (yield post_model_1.default.findById(postId).populate({
            path: "userId",
            select: "name _id email image",
        }));
        if (!post) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        const like = yield like_model_1.default.findOne({ postId, userId }).session(session);
        const user = yield user_model_1.User.findById(userId).select("name").session(session);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        const userName = `${(_a = user.name) === null || _a === void 0 ? void 0 : _a.firstName}${((_b = user.name) === null || _b === void 0 ? void 0 : _b.lastName) ? " " + user.name.lastName : ""}`;
        let isLiked;
        if (like) {
            yield like_model_1.default.findOneAndDelete({ postId, userId }, { session });
            isLiked = false;
        }
        else {
            yield like_model_1.default.create([{ postId, userId }], { session });
            isLiked = true;
            if (post.userId._id !== userId) {
                (0, handleNotification_1.handleNotification)(`${userName} likes your post`, post.userId._id);
                yield notification_model_1.Notification.create([
                    {
                        senderId: user._id,
                        receiverId: post.userId._id,
                        type: notification_interface_1.NotificationType.LIKE,
                        postId,
                        message: `\`${userName}\` likes your post`,
                    },
                ], { session });
            }
        }
        yield session.commitTransaction();
        session.endSession();
        return { isLiked };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.LikeService = {
    toggleLike,
};
