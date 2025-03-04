import mongoose from "mongoose";
import AppError from "../../../errors/AppError";
import { handleNotification } from "../../../socket/notification/handleNotification";
import { NotificationType } from "../../notification/notification.interface";
import { Notification } from "../../notification/notification.model";
import { User } from "../../user/user.model";
import Post from "../post/post.model";
import Like from "./like.model";
import httpStatus from "http-status";

const toggleLike = async (postId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = (await Post.findById(postId).populate({
      path: "userId",
      select: "name _id email image",
    })) as any;
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    const like = await Like.findOne({ postId, userId }).session(session);
    const user = await User.findById(userId).select("name").session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const userName = `${user.name?.firstName}${
      user.name?.lastName ? " " + user.name.lastName : ""
    }`;

    let isLiked: boolean;

    if (like) {
      await Like.findOneAndDelete({ postId, userId }, { session });
      isLiked = false;
    } else {
      await Like.create([{ postId, userId }], { session });
      isLiked = true;

      if (String(post.userId._id) !== String(userId)) {
        handleNotification(`${userName} likes your post`, post.userId._id);
        await Notification.create(
          [
            {
              senderId: user._id,
              receiverId: post.userId._id,
              type: NotificationType.LIKE,
              postId,
              message: `\`${userName}\` likes your post`,
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();
    return { isLiked };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const LikeService = {
  toggleLike,
};
