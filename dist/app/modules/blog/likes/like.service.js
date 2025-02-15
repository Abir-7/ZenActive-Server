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
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const post_model_1 = __importDefault(require("../post/post.model"));
const like_model_1 = __importDefault(require("./like.model"));
const http_status_1 = __importDefault(require("http-status"));
const toggleLike = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield post_model_1.default.findById(postId);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const isLiked = yield like_model_1.default.findOne({ postId, userId });
    if (isLiked) {
        yield like_model_1.default.findOneAndDelete({ postId, userId });
        return { message: "Like status updated" };
    }
    else {
        yield like_model_1.default.create({ postId, userId });
        return { message: "Like status updated" };
    }
});
exports.LikeService = {
    toggleLike,
};
