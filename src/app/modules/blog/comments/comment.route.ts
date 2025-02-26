import { Router } from "express";

import { CommentController } from "./comment.controller";

import { zodCommentSchema, zodVideoCommentSchema } from "./comment.validation";
import validateRequest from "../../../middleware/validator";
import auth from "../../../middleware/auth/auth";

const router = Router();
router.post(
  "/add-comment",
  validateRequest(zodCommentSchema),
  auth("USER"),
  CommentController.createComment
);
//
router.post(
  "/add-video-comment",
  validateRequest(zodVideoCommentSchema),
  auth("USER"),
  CommentController.createVideoComment
);
router.get("/video/:videoId", CommentController.fetchVideoCommentsByVideoId);
//
router.get("/post/:postId", CommentController.fetchCommentsByPostId);

router.patch("/:id", auth("USER"), CommentController.editComment);
router.delete("/:id", auth("USER"), CommentController.removeComment);

export const CommentRoute = router;
