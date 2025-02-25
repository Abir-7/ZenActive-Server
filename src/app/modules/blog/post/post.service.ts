import mongoose from "mongoose";
import Comment from "../comments/comment.model";
import { IPost } from "./post.interface";
import Post from "./post.model";
import Like from "../likes/like.model";
import Friend from "../../userConnection/friendList/friendlist.model";
import unlinkFile from "../../../utils/unlinkFiles";
import { UserGroup } from "../../socialGroup/UsersGroup/userGroup.model";

const createPost = async (data: Partial<IPost>) => {
  let post: IPost;
  if (data.groupId) {
    post = await Post.create({ ...data, isGroup: true });

    await UserGroup.findOneAndUpdate(
      { groupId: data.groupId, userId: data.userId },
      { $inc: { previousTotalPost: 1 } }
    );
  } else {
    post = await Post.create({ ...data, isGroup: false });
  }

  return post;
};

const editPost = async (postId: string, updatedData: Partial<IPost>) => {
  const isExistpost = await Post.findOne({ _id: postId, isDelete: false });

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

const getGroupsAllPosts = async (groupId: string) => {
  return await Post.aggregate([
    // Match only posts from the specified group
    {
      $match: {
        isGroup: true,
        groupId: new mongoose.Types.ObjectId(groupId),
        isDelete: false,
      },
    },

    // Lookup User details for post owner
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" }, // Convert user array into object
    {
      $project: {
        _id: 1,
        text: 1,
        image: 1,
        createdAt: 1,
        "user._id": 1,
        "user.email": 1,
        "user.name": 1,
        "user.image": 1,
      },
    },

    // Lookup Likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },

    // Lookup User details for Likes
    {
      $lookup: {
        from: "users",
        localField: "likes.userId",
        foreignField: "_id",
        as: "likesData",
      },
    },

    {
      $project: {
        _id: 1,
        text: 1,
        image: 1,
        createdAt: 1,
        user: 1,
        likes: {
          $map: {
            input: "$likesData",
            as: "like",
            in: {
              _id: "$$like._id",
              email: "$$like.email",
              name: "$$like.name",
              image: "$$like.image",
            },
          },
        },
      },
    },

    // Lookup Comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },

    // Lookup User details for Comments
    {
      $lookup: {
        from: "users",
        localField: "comments.userId",
        foreignField: "_id",
        as: "commentsData",
      },
    },

    {
      $project: {
        _id: 1,
        text: 1,
        image: 1,
        createdAt: 1,
        user: 1,
        likes: 1,
        comments: {
          $map: {
            input: "$commentsData",
            as: "comment",
            in: {
              _id: "$$comment._id",
              email: "$$comment.email",
              name: "$$comment.name",
              image: "$$comment.image",
              comment: {
                $arrayElemAt: [
                  "$comments.comment",
                  { $indexOfArray: ["$comments.userId", "$$comment._id"] },
                ],
              },
              createdAt: {
                $arrayElemAt: [
                  "$comments.createdAt",
                  { $indexOfArray: ["$comments.userId", "$$comment._id"] },
                ],
              },
            },
          },
        },
      },
    },

    // Ensure likes and comments are empty arrays if they are null
    {
      $addFields: {
        likes: { $ifNull: ["$likes", []] },
        comments: { $ifNull: ["$comments", []] },
      },
    },

    // Sort by latest posts
    { $sort: { createdAt: -1 } },
  ]);
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

const getUserAllGroupPost = async (userId: string, page: number = 1) => {
  try {
    const limit = 15; // Number of posts per page
    const skip = (page - 1) * limit; // Calculate offset

    // Step 1: Get all group IDs where the user is a member
    const userGroups = await UserGroup.find({ userId }).select("groupId");
    const groupIds = userGroups.map((ug) => ug.groupId);

    if (groupIds.length === 0)
      return {
        posts: [],
        meta: {
          limit,
          page,
          total: 0,
          totalPage: 0,
        },
      };

    // Step 2: Count total posts for pagination
    const total = await Post.countDocuments({
      groupId: { $in: groupIds },
      isGroup: true,
      isDelete: false,
    });

    const totalPage = Math.ceil(total / limit);

    // Step 3: Aggregate posts with pagination
    const posts = await Post.aggregate([
      {
        $match: {
          groupId: { $in: groupIds },
          isGroup: true,
          isDelete: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "group",
        },
      },
      { $unwind: "$group" },
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
        $project: {
          _id: 1,
          text: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.image": 1,
          "group._id": 1,
          "group.name": 1,
          "group.image": 1,
          comments: {
            _id: 1,
            comment: 1,
            createdAt: 1,
            userId: 1,
          },
          likes: {
            _id: 1,
            userId: 1,
          },
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by newest posts
      { $skip: skip }, // Skip posts for previous pages
      { $limit: limit }, // Limit results per page
    ]);

    return {
      posts,
      meta: {
        limit,
        page,
        total,
        totalPage,
      },
    };
  } catch (error) {
    console.error("Error fetching group posts:", error);
    throw new Error("Failed to fetch group posts");
  }
};
export const PostService = {
  createPost,
  editPost,
  getUserPosts,
  getGroupsAllPosts,
  deletePost,
  getAllUserPosts,
  getUserAllGroupPost,
};
