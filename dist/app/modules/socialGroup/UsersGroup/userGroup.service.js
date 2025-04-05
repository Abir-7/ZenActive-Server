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
exports.UserGroupService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const group_model_1 = require("../Group/group.model");
const userGroup_model_1 = require("./userGroup.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const post_model_1 = __importDefault(require("../../blog/post/post.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const friendlist_model_1 = __importDefault(require("../../userConnection/friendList/friendlist.model"));
const user_model_1 = require("../../user/user.model");
const notification_model_1 = require("../../notification/notification.model");
const handleNotification_1 = require("../../../socket/notification/handleNotification");
const notification_interface_1 = require("../../notification/notification.interface");
const getUserAllGroups = (userId_1, searchQuery_1, ...args_1) => __awaiter(void 0, [userId_1, searchQuery_1, ...args_1], void 0, function* (userId, searchQuery, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    // Fetch user's groups with pagination
    const userGroups = yield userGroup_model_1.UserGroup.find({ userId })
        .populate({
        path: "groupId",
        select: "name type goal admin image createdAt updatedAt",
    })
        .skip(skip)
        .limit(limit)
        .lean();
    // Get total count for pagination
    const total = yield userGroup_model_1.UserGroup.countDocuments({ userId });
    const totalPage = Math.ceil(total / limit);
    const updatedGroups = yield Promise.all(userGroups.map((userGroup) => __awaiter(void 0, void 0, void 0, function* () {
        const group = userGroup.groupId; // Extract the populated group
        if (!group)
            return null;
        const totalPostCount = yield post_model_1.default.countDocuments({ groupId: group._id });
        const newPostCount = Math.max(0, totalPostCount - userGroup.previousTotalPost);
        // Update the user's group data with the latest post count
        yield userGroup_model_1.UserGroup.updateOne({ _id: userGroup._id }, {
            newPost: newPostCount,
            previousTotalPost: totalPostCount,
        });
        return Object.assign(Object.assign({}, group), { newPost: newPostCount });
    })));
    const filteredGroups = updatedGroups.filter((group) => group !== null);
    // Apply search filter if provided
    let finalGroups = filteredGroups;
    if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, "i");
        finalGroups = filteredGroups.filter((group) => searchRegex.test(group.name));
    }
    return {
        meta: { limit, page, total, totalPage },
        data: finalGroups,
    };
});
const addUserToGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the group exists
        const group = yield group_model_1.Group.findOne({
            _id: groupId,
            isDeleted: false,
        }).session(session);
        if (!group) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Group not found");
        }
        const isJoined = yield userGroup_model_1.UserGroup.findOne({ groupId, userId }).session(session);
        if (isJoined) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already joined.");
        }
        const addUser = yield userGroup_model_1.UserGroup.create([{ groupId, userId }], { session });
        yield post_model_1.default.updateMany({ groupId, userId }, { isDelete: true }, { session });
        yield session.commitTransaction();
        session.endSession();
        return addUser[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const removeUserFromGroup = (groupId, userId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    if (adminId === userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Can not remove yourself from the group.");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Remove user from group
        const updatedGroup = yield userGroup_model_1.UserGroup.deleteOne({ groupId, userId }, { session });
        if (!updatedGroup) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove user from group: either the group does not exist or you are not authorized as admin");
        }
        // Update user's posts in the group
        yield post_model_1.default.updateMany({ groupId, userId }, { isDelete: true }, { session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return updatedGroup;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const leaveFromGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the user is an admin
        const isAdmin = yield group_model_1.Group.findOne({
            _id: groupId,
            admin: userId,
        }).session(session);
        if (isAdmin) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are an admin and cannot leave the group.");
        }
        // Check if the user is part of the group before attempting to delete
        const userGroup = yield userGroup_model_1.UserGroup.findOne({ userId, groupId }).session(session);
        if (!userGroup) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to leave group: You are not a member of this group.");
        }
        // Remove user from the group
        yield userGroup_model_1.UserGroup.deleteOne({ userId, groupId }).session(session);
        // Update user's posts in the group
        yield post_model_1.default.updateMany({ groupId, userId }, { isDelete: true }).session(session);
        // Commit transaction
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
    return { message: "Successfully left the group." };
});
// const inviteUserList = async (
//   groupId: string,
//   userId: string,
//   searchText?: string,
//   page: number = 1,
//   limit: number = 10
// ) => {
//   const userObjectId = new Types.ObjectId(userId);
//   const groupObjectId = new Types.ObjectId(groupId);
//   const skip = (page - 1) * limit;
//   // Step 1: Get user friends
//   const friends = await UserConnection.find({
//     $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
//     isAccepted: true,
//   });
//   const friendIds = friends.map((friend) =>
//     friend.senderId.equals(userObjectId) ? friend.receiverId : friend.senderId
//   );
//   // Step 2: Get users who are already in the group
//   const groupMembers = await UserGroup.find({ groupId: groupObjectId }).select(
//     "userId"
//   );
//   const groupMemberIds = groupMembers.map((member) => member.userId.toString());
//   // Step 3: Construct the query filter
//   const query: any = {
//     _id: { $in: friendIds, $nin: groupMemberIds },
//   };
//   // Step 4: Apply name or email search if provided
//   if (searchText) {
//     const searchRegex = new RegExp(searchText, "i"); // Case-insensitive search
//     query.$or = [
//       { "name.firstName": { $regex: searchRegex } }, // Search by first name
//       { "name.lastName": { $regex: searchRegex } }, // Search by last name
//       { email: { $regex: searchRegex } }, // Search by email
//     ];
//   }
//   // Step 5: Count total available friends who match the query
//   const total = await User.countDocuments(query);
//   const totalPage = Math.ceil(total / limit);
//   // Step 6: Fetch available users with pagination
//   const availableUsers = await User.find(query)
//     .select("email name image")
//     .skip(skip)
//     .limit(limit);
//   return {
//     meta: { limit, page, total, totalPage },
//     data: availableUsers,
//   };
// };
const inviteUserList = (groupId_1, userId_1, searchText_1, ...args_1) => __awaiter(void 0, [groupId_1, userId_1, searchText_1, ...args_1], void 0, function* (groupId, userId, searchText, page = 1, limit = 10) {
    var _a;
    const sessionUserId = new mongoose_1.default.Types.ObjectId(userId);
    const sessionGroupId = new mongoose_1.default.Types.ObjectId(groupId);
    try {
        // Get all accepted friends of the current user
        const friendsAggregate = yield friendlist_model_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: sessionUserId, isAccepted: true },
                        { receiverId: sessionUserId, isAccepted: true },
                    ],
                },
            },
            {
                $project: {
                    friendId: {
                        $cond: {
                            if: { $eq: ["$senderId", sessionUserId] },
                            then: "$receiverId",
                            else: "$senderId",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    friendIds: { $addToSet: "$friendId" },
                },
            },
        ]);
        const friendIds = ((_a = friendsAggregate[0]) === null || _a === void 0 ? void 0 : _a.friendIds) || [];
        if (friendIds.length === 0) {
            return {
                meta: { limit, page, total: 0, totalPage: 0 },
                data: [],
            };
        }
        // Find users already in the group
        const usersInGroup = yield userGroup_model_1.UserGroup.find({
            groupId: sessionGroupId,
            userId: { $in: friendIds },
        }).distinct("userId");
        // Filter out users already in the group
        const inviteCandidateIds = friendIds.filter((id) => !usersInGroup.some((ugId) => ugId.equals(id)));
        if (inviteCandidateIds.length === 0) {
            return {
                meta: { limit, page, total: 0, totalPage: 0 },
                data: [],
            };
        }
        // Build search query
        const searchQuery = { _id: { $in: inviteCandidateIds } };
        if (searchText) {
            const regex = new RegExp(searchText, "i");
            searchQuery.$or = [
                { username: regex },
                { email: regex },
                { firstName: regex },
                { lastName: regex },
            ];
        }
        // Get paginated results
        const [total, users] = yield Promise.all([
            user_model_1.User.countDocuments(searchQuery),
            user_model_1.User.find(searchQuery)
                .select("-password -refreshToken") // Exclude sensitive fields
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
        ]);
        // Check existing invitations
        const userIds = users.map((user) => user._id);
        const notifications = yield notification_model_1.Notification.find({
            senderId: sessionUserId,
            receiverId: { $in: userIds },
            type: notification_interface_1.NotificationType.JOIN_GROUP_REQUEST,
            groupId: sessionGroupId,
            isRead: false,
        });
        const invitedUserIds = new Set(notifications.map((n) => n.receiverId.toString()));
        // Add isInvited status to users
        const usersWithInviteStatus = users.map((user) => ({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            _id: user._id,
            isInvited: invitedUserIds.has(user._id.toString()),
        }));
        return {
            meta: {
                limit,
                page,
                total,
                totalPage: Math.ceil(total / limit),
            },
            data: usersWithInviteStatus,
        };
    }
    catch (error) {
        console.error("Error in inviteUserList:", error);
        throw new Error("Failed to fetch invite user list");
    }
});
const inviteUser = (groupId, userId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const sender = yield user_model_1.User.findOne({ _id: userId });
    const notification = yield notification_model_1.Notification.create({
        senderId: userId,
        receiverId,
        groupId,
        type: notification_interface_1.NotificationType.JOIN_GROUP_REQUEST,
        message: `\`${((_a = sender === null || sender === void 0 ? void 0 : sender.name) === null || _a === void 0 ? void 0 : _a.firstName) +
            (((_b = sender === null || sender === void 0 ? void 0 : sender.name) === null || _b === void 0 ? void 0 : _b.lastName) ? " " + sender.name.lastName : "")}\` requested you to join a group`,
    });
    (0, handleNotification_1.handleNotification)(`${((_c = sender === null || sender === void 0 ? void 0 : sender.name) === null || _c === void 0 ? void 0 : _c.firstName) +
        (((_d = sender === null || sender === void 0 ? void 0 : sender.name) === null || _d === void 0 ? void 0 : _d.lastName) ? " " + sender.name.lastName : "")} requested you to join a group`, receiverId);
    return notification;
});
exports.UserGroupService = {
    getUserAllGroups,
    addUserToGroup,
    removeUserFromGroup,
    leaveFromGroup,
    inviteUserList,
    inviteUser,
};
