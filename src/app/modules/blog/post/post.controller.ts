import { string } from "zod";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PostService } from "./post.service";
import httpStatus from "http-status";
// Create Post
const createPost = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { text, groupId } = req.body;
  const result = await PostService.createPost({ userId, text, groupId });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post successfully created.",
  });
});

// Edit Post
const editPost = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const result = await PostService.editPost(postId, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Post successfully updated.",
  });
});

const getUserPosts = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await PostService.getUserPosts(userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts fetched successfully.",
  });
});

const getGroupPosts = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await PostService.getGroupPosts(groupId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts fetched successfully.",
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await PostService.deletePost(postId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Post successfully deleted.",
  });
});

export const PostController = {
  createPost,
  editPost,
  getGroupPosts,
  getUserPosts,
  deletePost,
};
