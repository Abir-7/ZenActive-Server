import AppError from "../../../errors/AppError";
import Post from "../post/post.model";
import Like from "./like.model";
import httpStatus from "http-status";

const toggleLike = async (postId: string, userId: string) => {
  const isExist = await Post.findById(postId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const isLiked = await Like.findOne({ postId, userId });

  if (isLiked) {
    await Like.findOneAndDelete({ postId, userId });
    return { message: "Like status updated" };
  } else {
    await Like.create({ postId, userId });
    return { message: "Like status updated" };
  }
};

export const LikeService = {
  toggleLike,
};
