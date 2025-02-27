import express from "express";
import { PostController } from "./post.controller";
import auth from "../../../middleware/auth/auth";
import validateRequest from "../../../middleware/validator";
import { zodPostSchema } from "./post.validation";
import fileUploadHandler from "../../../middleware/fileUploadHandler";
import { parseField } from "../../../middleware/parseDataMiddleware";

const router = express.Router();

router.post(
  "/create",
  auth("USER"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodPostSchema),
  PostController.createPost
);
router.patch(
  "/:postId",
  auth("USER"),
  fileUploadHandler(),
  parseField("data"),
  PostController.editPost
);
router.get("/user-post", auth("USER"), PostController.getUserPosts);
router.get("/all-user-post", auth("USER"), PostController.getAllUserPosts);
router.get(
  "/user-all-group-post",
  auth("USER"),
  PostController.getUserAllGroupPost
);
router.get(
  "/group-post/:groupId",
  auth("USER"),
  PostController.getGroupsAllPosts
);
router.delete("/:postId", auth("USER"), PostController.deletePost);

export const PostRoute = router;
