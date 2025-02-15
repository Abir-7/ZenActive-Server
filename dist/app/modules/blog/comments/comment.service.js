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
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const post_model_1 = __importDefault(require("../post/post.model"));
const comment_model_1 = __importDefault(require("./comment.model"));
const http_status_1 = __importDefault(require("http-status"));
const addComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostExist = yield post_model_1.default.findById(commentData.postId);
    if (!isPostExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found to add comment.");
    }
    const comment = yield comment_model_1.default.create(commentData);
    return comment;
});
// const getCommentById = async (commentId: string) => {
//   return await Comment.findById(commentId).populate("postId userId").exec();
// };
const getCommentsByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_model_1.default.find({ postId })
        .populate({
        path: "userId",
        select: "name _id email image",
    })
        .exec();
});
const updateComment = (commentId, updateData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedComment = yield comment_model_1.default.findOneAndUpdate({ _id: commentId, userId }, updateData, { new: true });
    if (!updatedComment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found to update.");
    }
    return updatedComment;
});
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield comment_model_1.default.findById(commentId);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found to update.");
    }
    yield comment_model_1.default.findByIdAndDelete(commentId).exec();
    return { message: "Comment deleted" };
});
exports.CommentService = {
    addComment,
    //getCommentById,
    getCommentsByPostId,
    updateComment,
    deleteComment,
};
