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
exports.PostService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = __importDefault(require("../comments/comment.model"));
const post_model_1 = __importDefault(require("./post.model"));
const like_model_1 = __importDefault(require("../likes/like.model"));
const createPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let post;
    if (data.groupId) {
        post = yield post_model_1.default.create(Object.assign(Object.assign({}, data), { isGroup: true }));
    }
    else {
        post = yield post_model_1.default.create(Object.assign(Object.assign({}, data), { isGroup: false }));
    }
    return post;
});
const editPost = (postId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findOneAndUpdate({ postId, isDelete: false }, updatedData, { new: true });
    if (!post) {
        throw new Error("Post not found.");
    }
    return post;
});
const getUserPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ isGroup: false, userId, isDelete: false })
        .populate({
        path: "userId",
        select: "_id email name",
    })
        .populate({
        path: "comments",
        model: mongoose_1.default.models.Comment || comment_model_1.default,
    })
        .populate({
        path: "likes",
        model: mongoose_1.default.models.Like || like_model_1.default,
    });
    return result;
});
const getGroupPosts = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield post_model_1.default.find({ isGroup: true, groupId, isDelete: false })
        .populate({
        path: "userId",
        select: "_id email name",
    })
        .populate({
        path: "comments",
        model: mongoose_1.default.models.Comment || comment_model_1.default,
    })
        .populate({
        path: "likes",
        model: mongoose_1.default.models.Like || like_model_1.default,
    });
});
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findOneAndUpdate({ postId, isDelete: false }, { isDelete: true }, { new: true });
    if (!post) {
        throw new Error("Post not found or deleted");
    }
    return { message: "Post deleted" };
});
exports.PostService = {
    createPost,
    editPost,
    getUserPosts,
    getGroupPosts,
    deletePost,
};
