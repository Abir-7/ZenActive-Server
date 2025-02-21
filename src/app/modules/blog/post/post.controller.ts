import { string } from "zod";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PostService } from "./post.service";
import httpStatus from "http-status";
// Create Post
const createPost = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { text, groupId } = req.body;

  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const result = await PostService.createPost({ userId, text, groupId, image });
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

  let image = null;
  let value = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  if (image) {
    value = {
      ...req.body,
      image,
    };
  } else {
    value = req.body;
  }

  const result = await PostService.editPost(postId, value);
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

const getAllUserPosts = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await PostService.getAllUserPosts(userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts from users fetched successfully.",
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
  getAllUserPosts,
};
