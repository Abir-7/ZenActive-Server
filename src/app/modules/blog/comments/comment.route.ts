import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { CommentController } from "./comment.controller";
import validateRequest from "../../../middleware/validator";
import { zodCommentSchema } from "./comment.validation";

const router = Router();
router.post(
  "/add-comment",
  validateRequest(zodCommentSchema),
  auth("USER"),
  CommentController.createComment
);
// router.get("/comments/:id", CommentController.fetchCommentById);
router.get("/post/:postId", CommentController.fetchCommentsByPostId);

router.patch("/:id", auth("USER"), CommentController.editComment);
router.delete("/:id", auth("USER"), CommentController.removeComment);

export const CommentRoute = router;
