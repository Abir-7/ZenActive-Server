import express from "express";
import { PostController } from "./post.controller";
import auth from "../../../middleware/auth/auth";
import validateRequest from "../../../middleware/validator";
import { zodPostSchema } from "./post.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(zodPostSchema),
  auth("USER"),
  PostController.createPost
);
router.patch(
  "/:postId",
  validateRequest(zodPostSchema),
  auth("USER"),
  PostController.editPost
);
router.get("/user-post", auth("USER"), PostController.getUserPosts);
router.get("/all-user-post", auth("USER"), PostController.getAllUserPosts);
router.get("/group-post/:groupId", auth("USER"), PostController.getGroupPosts);
router.delete("/:postId", auth("USER"), PostController.deletePost);

export const PostRoute = router;
