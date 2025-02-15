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
exports.CommentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const comment_service_1 = require("./comment.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { postId, comment } = req.body;
    const result = yield comment_service_1.CommentService.addComment({ userId, postId, comment });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Comment successfully created.",
    });
}));
// const fetchCommentById = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await CommentService.getCommentById(id);
//   sendResponse(res, {
//     data: result,
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Comment fetched successfully.",
//   });
// });
const fetchCommentsByPostId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const result = yield comment_service_1.CommentService.getCommentsByPostId(postId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comments fetched successfully.",
    });
}));
const editComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const updateData = req.body;
    const result = yield comment_service_1.CommentService.updateComment(id, updateData, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment updated successfully.",
    });
}));
const removeComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield comment_service_1.CommentService.deleteComment(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment deleted successfully.",
    });
}));
exports.CommentController = {
    createComment,
    //fetchCommentById,
    fetchCommentsByPostId,
    editComment,
    removeComment,
};
