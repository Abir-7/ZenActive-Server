import AppError from "../../../errors/AppError";
import Post from "../post/post.model";
import { IComment } from "./comment.interface";
import Comment from "./comment.model";
import httpStatus from "http-status";
const addComment = async (commentData: IComment) => {
  const isPostExist = await Post.findById(commentData.postId);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found to add comment.");
  }
  const comment = await Comment.create(commentData);

  return comment;
};

// const getCommentById = async (commentId: string) => {
//   return await Comment.findById(commentId).populate("postId userId").exec();
// };

const getCommentsByPostId = async (postId: string) => {
  return await Comment.find({ postId })
    .populate({
      path: "userId",
      select: "name _id email image",
    })
    .exec();
};

const updateComment = async (
  commentId: string,
  updateData: { comment: string },
  userId: string
) => {
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, userId },
    updateData,
    { new: true }
  );

  if (!updatedComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found to update.");
  }

  return updatedComment;
};

const deleteComment = async (commentId: string) => {
  const isExist = await Comment.findById(commentId);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found to update.");
  }

  await Comment.findByIdAndDelete(commentId).exec();
  return { message: "Comment deleted" };
};

export const CommentService = {
  addComment,
  //getCommentById,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
