import AppError from "../../../errors/AppError";
import Post from "../post/post.model";
import Like from "./like.model";
import httpStatus from "http-status";

const toggleLike = async (postId: string, userId: string) => {
  const result = await Like.updateOne(
    { postId, userId },
    { $set: { isLiked: true } },
    { upsert: true }
  );

  const isExist = await Post.findById(postId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (result.upsertedCount > 0) {
    const like = await Like.findOne({ postId, userId });
    await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: like?._id } },
      { new: true }
    );
    return result;
  } else {
    const like = await Like.findOne({ postId, userId });
    if (like) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: like._id } }, // Remove like from post
        { new: true }
      );
      await Like.deleteOne({ postId, userId });
    }

    return { message: "Like Status Updated" };
  }
};

export const LikeService = {
  toggleLike,
};
