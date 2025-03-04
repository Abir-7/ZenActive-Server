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
exports.CommentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const handleNotification_1 = require("../../../socket/notification/handleNotification");
const notification_interface_1 = require("../../notification/notification.interface");
const notification_model_1 = require("../../notification/notification.model");
const user_model_1 = require("../../user/user.model");
const post_model_1 = __importDefault(require("../post/post.model"));
const http_status_1 = __importDefault(require("http-status"));
const comment_model_1 = require("./comment.model");
const workoutVideo_model_1 = require("../../workout&exercise/workoutVideos/workoutVideo.model");
const addComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const post = (yield post_model_1.default.findById(commentData.postId)
            .populate({
            path: "userId",
            select: "name _id email image",
        })
            .session(session));
        if (!post) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found to add comment.");
        }
        const comment = yield comment_model_1.Comment.create([commentData], { session });
        const user = yield user_model_1.User.findById(commentData.userId).session(session);
        const userName = `${(_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.firstName}${((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.lastName) ? " " + user.name.lastName : ""}`;
        if (post.userId._id !== commentData.userId) {
            (0, handleNotification_1.handleNotification)(`${userName} commented on your post`, post.userId._id);
            yield notification_model_1.Notification.create([
                {
                    senderId: commentData.userId,
                    receiverId: post.userId._id,
                    type: notification_interface_1.NotificationType.COMMENT,
                    postId: commentData.postId,
                    message: `\`${userName}\` commented on your post`,
                },
            ], { session });
        }
        yield session.commitTransaction();
        session.endSession();
        return comment[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const addVideoComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const video = (yield workoutVideo_model_1.WorkoutVideo.findById(commentData.videoId).session(session));
        if (!video) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Video not found to add comment.");
        }
        const comment = yield comment_model_1.VideoComment.create([commentData], { session });
        // const user = await User.findById(commentData.userId).session(session);
        // const userName = `${user?.name?.firstName}${
        //   user?.name?.lastName ? " " + user.name.lastName : ""
        // }`;
        // await Notification.create(
        //   [
        //     {
        //       senderId: commentData.userId,
        //       receiverId: "admin",
        //       type: NotificationType.COMMENT,
        //       postId: commentData.videoId,
        //       message: `${userName} commented on your post`,
        //     },
        //   ],
        //   { session }
        // );
        // handleNotification(`${userName} commented on your post`, "admin");
        yield session.commitTransaction();
        session.endSession();
        return comment[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// const getCommentById = async (commentId: string) => {
//   return await Comment.findById(commentId).populate("postId userId").exec();
// };
const getCommentsByPostId = (postId_1, ...args_1) => __awaiter(void 0, [postId_1, ...args_1], void 0, function* (postId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    // Get total count for pagination
    const total = yield comment_model_1.Comment.countDocuments({ postId });
    const totalPage = Math.ceil(total / limit);
    const comments = yield comment_model_1.Comment.find({ postId })
        .populate({
        path: "userId",
        select: "name _id email image",
    })
        .skip(skip)
        .limit(limit)
        .exec();
    return {
        meta: { limit, page, total, totalPage },
        data: comments,
    };
});
const getVideoCommentsByVideoId = (videoId_1, ...args_1) => __awaiter(void 0, [videoId_1, ...args_1], void 0, function* (videoId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    // Get total count for pagination
    const total = yield comment_model_1.VideoComment.countDocuments({ videoId });
    const totalPage = Math.ceil(total / limit);
    const comments = yield comment_model_1.VideoComment.find({ videoId })
        .populate({
        path: "userId",
        select: "name _id email image",
    })
        .skip(skip)
        .limit(limit)
        .exec();
    return {
        meta: { limit, page, total, totalPage },
        data: comments,
    };
});
const updateComment = (commentId, updateData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedComment = yield comment_model_1.Comment.findOneAndUpdate({ _id: commentId, userId }, updateData, { new: true });
    if (!updatedComment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found to update.");
    }
    return updatedComment;
});
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield comment_model_1.Comment.findById(commentId);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found to update.");
    }
    yield comment_model_1.Comment.findByIdAndDelete(commentId).exec();
    return { message: "Comment deleted" };
});
exports.CommentService = {
    addComment,
    //getCommentById,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    addVideoComment,
    getVideoCommentsByVideoId,
};
