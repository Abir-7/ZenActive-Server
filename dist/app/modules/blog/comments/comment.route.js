"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const comment_controller_1 = require("./comment.controller");
const validator_1 = __importDefault(require("../../../middleware/validator"));
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
router.post("/add-comment", (0, validator_1.default)(comment_validation_1.zodCommentSchema), (0, auth_1.default)("USER"), comment_controller_1.CommentController.createComment);
// router.get("/comments/:id", CommentController.fetchCommentById);
router.get("/post/:postId", comment_controller_1.CommentController.fetchCommentsByPostId);
router.patch("/:id", (0, auth_1.default)("USER"), comment_controller_1.CommentController.editComment);
router.delete("/:id", (0, auth_1.default)("USER"), comment_controller_1.CommentController.removeComment);
exports.CommentRoute = router;
