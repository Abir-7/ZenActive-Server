import mongoose from "mongoose";
import AppError from "../../../errors/AppError";
import { handleNotification } from "../../../socket/notification/handleNotification";
import { NotificationType } from "../../notification/notification.interface";
import { Notification } from "../../notification/notification.model";
import { User } from "../../user/user.model";
import Post from "../post/post.model";
import { IComment, IVideoComment } from "./comment.interface";

import httpStatus from "http-status";
import { Comment, VideoComment } from "./comment.model";
import { WorkoutVideo } from "../../workout&exercise/workoutVideos/workoutVideo.model";

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
          message: `\`${userName}\` commented on your post`,
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

const addVideoComment = async (commentData: IVideoComment) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const video = (await WorkoutVideo.findById(commentData.videoId).session(
      session
    )) as any;

    if (!video) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Video not found to add comment."
      );
    }

    const comment = await VideoComment.create([commentData], { session });
    // const user = await User.findById(commentData.userId).session(session);

    // const userName = `${user?.name?.firstName}${
    //   user?.name?.lastName ? " " + user.name.lastName : ""
    // }`;

    // await Notification.create(
    //   [
    //     {
    //       senderId: commentData.userId,
    //       receiverId: "admin",
    //       type: NotificationType.COMMENT,
    //       postId: commentData.videoId,
    //       message: `${userName} commented on your post`,
    //     },
    //   ],
    //   { session }
    // );

    // handleNotification(`${userName} commented on your post`, "admin");
    await session.commitTransaction();
    session.endSession();
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
const getCommentsByPostId = async (
  postId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await Comment.countDocuments({ postId });
  const totalPage = Math.ceil(total / limit);

  const comments = await Comment.find({ postId })
    .populate({
      path: "userId",
      select: "name _id email image",
    })
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    meta: { limit, page, total, totalPage },
    data: comments,
  };
};

const getVideoCommentsByVideoId = async (
  videoId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await VideoComment.countDocuments({ videoId });
  const totalPage = Math.ceil(total / limit);

  const comments = await VideoComment.find({ videoId })
    .populate({
      path: "userId",
      select: "name _id email image",
    })
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    meta: { limit, page, total, totalPage },
    data: comments,
  };
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
  addVideoComment,
  getVideoCommentsByVideoId,
};
