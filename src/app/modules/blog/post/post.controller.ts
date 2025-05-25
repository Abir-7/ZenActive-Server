import { string } from "zod";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PostService } from "./post.service";
import httpStatus from "http-status";
import mongoose from "mongoose";
// Create Post
const createPost = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { text, groupId } = req.body;

  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const result = await PostService.createPost({
    userId: new mongoose.Types.ObjectId(userId),
    text,
    groupId,
    image,
  });
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
  const { page = 1, limit = 15 } = req.query;
  const result = await PostService.getAllUserPosts(
    userId,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts from users fetched successfully.",
  });
});

const getGroupsAllPosts = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 25 } = req.query;
  const result = await PostService.getGroupsAllPosts(
    groupId,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts fetched successfully.",
  });
});

const getUserAllGroupPost = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { page = 1 } = req.query;
  const result = await PostService.getUserAllGroupPost(userId, Number(page));
  sendResponse(res, {
    data: result.posts,
    meta: result.meta,
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
  getGroupsAllPosts,
  getUserPosts,
  deletePost,
  getAllUserPosts,
  getUserAllGroupPost,
};
