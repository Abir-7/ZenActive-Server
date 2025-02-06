import mongoose from "mongoose";
import Comment from "../comments/comment.model";
import { IPost } from "./post.interface";
import Post from "./post.model";
import Like from "../likes/like.model";

const createPost = async (data: Partial<IPost>) => {
  let post: IPost;
  if (data.groupId) {
    post = await Post.create({ ...data, isGroup: true });
  } else {
    post = await Post.create({ ...data, isGroup: false });
  }

  return post;
};

const editPost = async (postId: string, updatedData: IPost) => {
  const post = await Post.findOneAndUpdate(
    { postId, isDelete: false },
    updatedData,
    { new: true }
  );
  if (!post) {
    throw new Error("Post not found.");
  }
  return post;
};

const getUserPosts = async (userId: string) => {
  const result = await Post.find({ isGroup: false, userId, isDelete: false })
    .populate({
      path: "userId",
      select: "_id email name",
    })
    .populate({
      path: "comments",
      model: mongoose.models.Comment || Comment,
    })
    .populate({
      path: "likes",
      model: mongoose.models.Like || Like,
    });

  return result;
};

const getGroupPosts = async (groupId: string) => {
  return await Post.find({ isGroup: true, groupId, isDelete: false })
    .populate({
      path: "userId",
      select: "_id email name",
    })
    .populate({
      path: "comments",
      model: mongoose.models.Comment || Comment,
    })
    .populate({
      path: "likes",
      model: mongoose.models.Like || Like,
    });
};

const deletePost = async (postId: string) => {
  const post = await Post.findOneAndUpdate(
    { postId, isDelete: false },
    { isDelete: true },
    { new: true }
  );

  if (!post) {
    throw new Error("Post not found or deleted");
  }
  return { message: "Post deleted" };
};

export const PostService = {
  createPost,
  editPost,
  getUserPosts,
  getGroupPosts,
  deletePost,
};
