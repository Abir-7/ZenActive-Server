import mongoose from "mongoose";
import AppError from "../../../errors/AppError";
import { handleNotification } from "../../../socket/notification/handleNotification";
import { NotificationType } from "../../notification/notification.interface";
import { Notification } from "../../notification/notification.model";
import { User } from "../../user/user.model";
import Post from "../post/post.model";
import { IComment } from "./comment.interface";
import Comment from "./comment.model";
import httpStatus from "http-status";

const addComment = async (commentData: IComment) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = (await Post.findById(commentData.postId)
      .populate("userId")
      .session(session)) as any;
    if (!post) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Post not found to add comment."
      );
    }

    const comment = await Comment.create([commentData], { session });
    const user = await User.findById(commentData.userId).session(session);

    const userName = `${user?.name?.firstName}${
      user?.name?.lastName ? " " + user.name.lastName : ""
    }`;

    await Notification.create(
      [
        {
          senderId: commentData.userId,
          receiverId: post.userId._id,
          type: NotificationType.COMMENT,
          postId: commentData.postId,
          message: `${userName} commented on your post`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    handleNotification(`${userName} commented on your post`, post.userId._id);

    return comment[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
