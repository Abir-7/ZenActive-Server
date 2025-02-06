"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoute = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../../middleware/validator"));
const post_validation_1 = require("./post.validation");
const router = express_1.default.Router();
router.post("/create", (0, validator_1.default)(post_validation_1.zodPostSchema), (0, auth_1.default)("USER"), post_controller_1.PostController.createPost);
router.patch("/:postId", (0, validator_1.default)(post_validation_1.zodPostSchema), (0, auth_1.default)("USER"), post_controller_1.PostController.editPost);
router.get("/user-post", (0, auth_1.default)("USER"), post_controller_1.PostController.getUserPosts);
router.get("/group-post/:groupId", (0, auth_1.default)("USER"), post_controller_1.PostController.getGroupPosts);
router.delete("/:postId", (0, auth_1.default)("USER"), post_controller_1.PostController.deletePost);
exports.PostRoute = router;
