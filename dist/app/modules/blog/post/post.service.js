"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("./post.model"));
const friendlist_model_1 = __importDefault(require("../../userConnection/friendList/friendlist.model"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const userGroup_model_1 = require("../../socialGroup/UsersGroup/userGroup.model");
const createPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let post;
    console.log(data);
    if (data.groupId) {
        post = yield post_model_1.default.create(Object.assign(Object.assign({}, data), { isGroup: true }));
        yield userGroup_model_1.UserGroup.findOneAndUpdate({ groupId: data.groupId, userId: data.userId }, { $inc: { previousTotalPost: 1 } });
    }
    else {
        post = yield post_model_1.default.create(Object.assign(Object.assign({}, data), { isGroup: false }));
    }
    return post;
});
const editPost = (postId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistpost = yield post_model_1.default.findOne({ _id: postId, isDelete: false });
    if (isExistpost === null || isExistpost === void 0 ? void 0 : isExistpost.image) {
        if (updatedData.image) {
            (0, unlinkFiles_1.default)(isExistpost === null || isExistpost === void 0 ? void 0 : isExistpost.image);
        }
    }
    const post = yield post_model_1.default.findOneAndUpdate({ _id: postId, isDelete: false }, updatedData, { new: true });
    if (!post) {
        throw new Error("Post not found.");
    }
    return post;
});
const getUserPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
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
});
const getAllUserPosts = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 15) {
    const skip = (page - 1) * limit;
    const friends = yield friendlist_model_1.default.find({
        $or: [
            { senderId: userId, isAccepted: true },
            { receiverId: userId, isAccepted: true },
        ],
    });
    // Get friend IDs and include the logged-in user
    const friendIds = friends.map((friend) => friend.senderId.toString() === userId ? friend.receiverId : friend.senderId);
    friendIds.push(new mongoose_1.default.Types.ObjectId(userId));
    // Get total count for pagination
    const total = yield post_model_1.default.countDocuments({
        userId: { $in: friendIds },
        isDelete: false,
        isGroup: false,
    });
    const totalPage = Math.ceil(total / limit);
    const posts = yield post_model_1.default.aggregate([
        {
            $match: {
                userId: { $in: friendIds },
                isDelete: false,
                isGroup: false,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        { $unwind: "$userInfo" },
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
            $addFields: {
                isLiked: {
                    $in: [new mongoose_1.default.Types.ObjectId(userId), "$likes.userId"],
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
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
    ]);
    return {
        meta: { limit, page, total, totalPage },
        data: posts,
    };
});
const getGroupsAllPosts = (groupId_1, ...args_1) => __awaiter(void 0, [groupId_1, ...args_1], void 0, function* (groupId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    // Step 1: Count total posts for pagination
    const total = yield post_model_1.default.countDocuments({
        isGroup: true,
        groupId: new mongoose_1.default.Types.ObjectId(groupId),
        isDelete: false,
    });
    const totalPage = Math.ceil(total / limit);
    // Step 2: Fetch posts with pagination
    const posts = yield post_model_1.default.aggregate([
        // Match only posts from the specified group
        {
            $match: {
                isGroup: true,
                groupId: new mongoose_1.default.Types.ObjectId(groupId),
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
        // Apply pagination
        { $skip: skip },
        { $limit: limit },
    ]);
    return {
        meta: { limit, page, total, totalPage },
        data: posts,
    };
});
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findOneAndUpdate({ postId, isDelete: false }, { isDelete: true }, { new: true });
    if (!post) {
        throw new Error("Post not found or deleted");
    }
    return { message: "Post deleted" };
});
const getUserAllGroupPost = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1) {
    try {
        const limit = 20; // Number of posts per page
        const skip = (page - 1) * limit; // Calculate offset
        // Step 1: Get all group IDs where the user is a member
        const userGroups = yield userGroup_model_1.UserGroup.find({ userId }).select("groupId");
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
        const total = yield post_model_1.default.countDocuments({
            groupId: { $in: groupIds },
            isGroup: true,
            isDelete: false,
        });
        const totalPage = Math.ceil(total / limit);
        // Step 3: Aggregate posts with pagination
        const posts = yield post_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error fetching group posts:", error);
        throw new Error("Failed to fetch group posts");
    }
});
exports.PostService = {
    createPost,
    editPost,
    getUserPosts,
    getGroupsAllPosts,
    deletePost,
    getAllUserPosts,
    getUserAllGroupPost,
};
