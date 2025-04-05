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
exports.PostController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const http_status_1 = __importDefault(require("http-status"));
// Create Post
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { text, groupId } = req.body;
    let image = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const result = yield post_service_1.PostService.createPost({ userId, text, groupId, image });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Post successfully created.",
    });
}));
// Edit Post
const editPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    let image = null;
    let value = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (image) {
        value = Object.assign(Object.assign({}, req.body), { image });
    }
    else {
        value = req.body;
    }
    const result = yield post_service_1.PostService.editPost(postId, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post successfully updated.",
    });
}));
const getUserPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield post_service_1.PostService.getUserPosts(userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Posts fetched successfully.",
    });
}));
const getAllUserPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { page = 1, limit = 15 } = req.query;
    const result = yield post_service_1.PostService.getAllUserPosts(userId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Posts from users fetched successfully.",
    });
}));
const getGroupsAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    const { page = 1, limit = 25 } = req.query;
    const result = yield post_service_1.PostService.getGroupsAllPosts(groupId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Posts fetched successfully.",
    });
}));
const getUserAllGroupPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { page = 1 } = req.query;
    const result = yield post_service_1.PostService.getUserAllGroupPost(userId, Number(page));
    (0, sendResponse_1.default)(res, {
        data: result.posts,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Posts fetched successfully.",
    });
}));
const deletePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const result = yield post_service_1.PostService.deletePost(postId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post successfully deleted.",
    });
}));
exports.PostController = {
    createPost,
    editPost,
    getGroupsAllPosts,
    getUserPosts,
    deletePost,
    getAllUserPosts,
    getUserAllGroupPost,
};
