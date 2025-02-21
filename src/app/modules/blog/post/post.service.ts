import mongoose from "mongoose";
import Comment from "../comments/comment.model";
import { IPost } from "./post.interface";
import Post from "./post.model";
import Like from "../likes/like.model";
import Friend from "../../userConnection/friendList/friendlist.model";
import unlinkFile from "../../../utils/unlinkFiles";

const createPost = async (data: Partial<IPost>) => {
  console.log(data);
  let post: IPost;
  if (data.groupId) {
    post = await Post.create({ ...data, isGroup: true });
  } else {
    post = await Post.create({ ...data, isGroup: false });
  }

  return post;
};

const editPost = async (postId: string, updatedData: Partial<IPost>) => {
  console.log(postId, "------------->");
  const isExistpost = await Post.findOne({ _id: postId, isDelete: false });
  console.log(isExistpost);
  if (isExistpost?.image) {
    if (updatedData.image) {
      unlinkFile(isExistpost?.image);
    }
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId, isDelete: false },
    updatedData,
    { new: true }
  );
  if (!post) {
    throw new Error("Post not found.");
  }
  return post;
};

const getUserPosts = async (userId: string) => {
  const result = await Post.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by latest post
    },
  ]);

  return result;
};

const getAllUserPosts = async (userId: string) => {
  const friends = await Friend.find({
    $or: [
      { senderId: userId, isAccepted: true },
      { receiverId: userId, isAccepted: true },
    ],
  });

  // Get friend IDs and include the logged-in user
  const friendIds = friends.map((friend) =>
    friend.senderId.toString() === userId ? friend.receiverId : friend.senderId
  );
  friendIds.push(new mongoose.Types.ObjectId(userId));

  const posts = await Post.aggregate([
    {
      $match: {
        userId: { $in: friendIds }, // Get posts from user and friends
        isDelete: false, // Exclude deleted posts
        isGroup: false,
      },
    },
    {
      $lookup: {
        from: "users", // Join with users collection
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo", // Convert array to object
    },
    {
      $lookup: {
        from: "comments", // Join with comments
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes", // Join with likes
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },
    {
      $addFields: {
        isLiked: {
          $in: [new mongoose.Types.ObjectId(userId), "$likes.userId"], // Check if the user liked the post
        },
      },
    },
    {
      $project: {
        _id: 1,
        text: 1,
        userId: 1,
        groupId: 1,
        isGroup: 1,
        isDelete: 1,
        createdAt: 1,
        updatedAt: 1,
        isLiked: 1,
        comments: 1,
        likes: 1,
        "userInfo._id": 1,
        "userInfo.email": 1,
        "userInfo.name": 1,
        "userInfo.image": 1,
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by latest posts
    },
  ]);

  return posts;
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
  getAllUserPosts,
};
