import status from "http-status";
import { Group } from "../Group/group.model";
import { UserGroup } from "./userGroup.model";
import AppError from "../../../errors/AppError";
import Post from "../../blog/post/post.model";
import mongoose, { Types } from "mongoose";
import UserConnection from "../../userConnection/friendList/friendlist.model";
import { User } from "../../user/user.model";
import { Notification } from "../../notification/notification.model";
import { handleNotification } from "../../../socket/notification/handleNotification";
import { NotificationType } from "../../notification/notification.interface";

const getUserAllGroups = async (
  userId: string,
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  // Fetch user's groups with pagination
  const userGroups = await UserGroup.find({ userId })
    .populate({
      path: "groupId",
      select: "name type goal admin image createdAt updatedAt",
    })
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const total = await UserGroup.countDocuments({ userId });
  const totalPage = Math.ceil(total / limit);

  const updatedGroups = await Promise.all(
    userGroups.map(async (userGroup) => {
      const group = userGroup.groupId; // Extract the populated group
      if (!group) return null;

      const totalPostCount = await Post.countDocuments({ groupId: group._id });

      const newPostCount = Math.max(
        0,
        totalPostCount - userGroup.previousTotalPost
      );

      // Update the user's group data with the latest post count
      await UserGroup.updateOne(
        { _id: userGroup._id },
        {
          newPost: newPostCount,
          previousTotalPost: totalPostCount,
        }
      );

      return {
        ...group,
        newPost: newPostCount,
      };
    })
  );

  const filteredGroups = updatedGroups.filter((group) => group !== null);

  // Apply search filter if provided
  let finalGroups = filteredGroups;
  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery, "i");
    finalGroups = filteredGroups.filter((group: any) =>
      searchRegex.test(group.name)
    );
  }

  return {
    meta: { limit, page, total, totalPage },
    data: finalGroups,
  };
};

const addUserToGroup = async (groupId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the group exists
    const group = await Group.findOne({
      _id: groupId,
      isDeleted: false,
    }).session(session);
    if (!group) {
      throw new AppError(status.NOT_FOUND, "Group not found");
    }

    const isJoined = await UserGroup.findOne({ groupId, userId }).session(
      session
    );
    if (isJoined) {
      throw new AppError(status.BAD_REQUEST, "User already joined.");
    }

    const addUser = await UserGroup.create([{ groupId, userId }], { session });

    await Post.updateMany({ groupId, userId }, { isDelete: true }, { session });

    await session.commitTransaction();
    session.endSession();

    return addUser[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const removeUserFromGroup = async (
  groupId: string,
  userId: string,
  adminId: string
) => {
  if (adminId === userId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Can not remove yourself from the group."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove user from group
    const updatedGroup = await UserGroup.deleteOne(
      { groupId, userId },
      { session }
    );
    if (!updatedGroup) {
      throw new AppError(
        status.BAD_REQUEST,
        "Failed to remove user from group: either the group does not exist or you are not authorized as admin"
      );
    }

    // Update user's posts in the group
    await Post.updateMany({ groupId, userId }, { isDelete: true }, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return updatedGroup;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const leaveFromGroup = async (groupId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user is an admin
    const isAdmin = await Group.findOne({
      _id: groupId,
      admin: userId,
    }).session(session);
    if (isAdmin) {
      throw new AppError(
        status.BAD_REQUEST,
        "You are an admin and cannot leave the group."
      );
    }

    // Check if the user is part of the group before attempting to delete
    const userGroup = await UserGroup.findOne({ userId, groupId }).session(
      session
    );
    if (!userGroup) {
      throw new AppError(
        status.BAD_REQUEST,
        "Failed to leave group: You are not a member of this group."
      );
    }

    // Remove user from the group
    await UserGroup.deleteOne({ userId, groupId }).session(session);

    // Update user's posts in the group
    await Post.updateMany({ groupId, userId }, { isDelete: true }).session(
      session
    );

    // Commit transaction
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return { message: "Successfully left the group." };
};

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
const inviteUserList = async (
  groupId: string,
  userId: string,
  searchText?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  meta: { limit: number; page: number; total: number; totalPage: number };
  data: Array<any>;
}> => {
  const sessionUserId = new mongoose.Types.ObjectId(userId);
  const sessionGroupId = new mongoose.Types.ObjectId(groupId);

  try {
    // Get all accepted friends of the current user
    const friendsAggregate = await UserConnection.aggregate([
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

    const friendIds = friendsAggregate[0]?.friendIds || [];
    if (friendIds.length === 0) {
      return {
        meta: { limit, page, total: 0, totalPage: 0 },
        data: [],
      };
    }

    // Find users already in the group
    const usersInGroup = await UserGroup.find({
      groupId: sessionGroupId,
      userId: { $in: friendIds },
    }).distinct("userId");

    // Filter out users already in the group
    const inviteCandidateIds = friendIds.filter(
      (id: string) => !usersInGroup.some((ugId) => ugId.equals(id))
    );

    if (inviteCandidateIds.length === 0) {
      return {
        meta: { limit, page, total: 0, totalPage: 0 },
        data: [],
      };
    }

    // Build search query
    const searchQuery: any = { _id: { $in: inviteCandidateIds } };
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
    const [total, users] = await Promise.all([
      User.countDocuments(searchQuery),
      User.find(searchQuery)
        .select("-password -refreshToken") // Exclude sensitive fields
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    // Check existing invitations
    const userIds = users.map((user) => user._id);
    const notifications = await Notification.find({
      senderId: sessionUserId,
      receiverId: { $in: userIds },
      type: NotificationType.JOIN_GROUP_REQUEST,
      groupId: sessionGroupId,
      isRead: false,
    });

    const invitedUserIds = new Set(
      notifications.map((n) => n.receiverId.toString())
    );

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
  } catch (error) {
    console.error("Error in inviteUserList:", error);
    throw new Error("Failed to fetch invite user list");
  }
};

const inviteUser = async (
  groupId: string,
  userId: string,
  receiverId: string
) => {
  const sender = await User.findOne({ _id: userId });

  const notification = await Notification.create({
    senderId: userId,
    receiverId,
    groupId,
    type: NotificationType.JOIN_GROUP_REQUEST,
    message: `\`${
      sender?.name?.firstName +
      (sender?.name?.lastName ? " " + sender.name.lastName : "")
    }\` requested you to join a group`,
  });

  handleNotification(
    `${
      sender?.name?.firstName +
      (sender?.name?.lastName ? " " + sender.name.lastName : "")
    } requested you to join a group`,
    receiverId
  );

  return notification;
};

export const UserGroupService = {
  getUserAllGroups,
  addUserToGroup,
  removeUserFromGroup,
  leaveFromGroup,
  inviteUserList,
  inviteUser,
};
