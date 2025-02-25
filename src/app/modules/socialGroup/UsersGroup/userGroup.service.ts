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

const getUserAllGroups = async (userId: string, searchQuery?: string) => {
  const userGroups = await UserGroup.find({ userId })
    .populate({
      path: "groupId",
      select: "name type goal admin image createdAt updatedAt",
    })
    .lean();

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

  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery, "i");
    return filteredGroups.filter((group: any) => searchRegex.test(group.name));
  }

  return filteredGroups;
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

const inviteUserList = async (groupId: string, userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const groupObjectId = new Types.ObjectId(groupId);

  // Get user friends
  const friends = await UserConnection.find({
    $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
    isAccepted: true,
  });

  const friendIds = friends.map((friend) =>
    friend.senderId.equals(userObjectId) ? friend.receiverId : friend.senderId
  );

  // Get users who are already in the group
  const groupMembers = await UserGroup.find({ groupId: groupObjectId }).select(
    "userId"
  );
  console.log(groupId);
  const groupMemberIds = groupMembers.map((member) => member.userId.toString());
  console.log(groupMemberIds);
  // Filter friends who are NOT in the group
  const availableUsers = await User.find({
    _id: { $in: friendIds, $nin: groupMemberIds },
  }).select("email name image");

  return availableUsers;
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
    message: `${
      sender?.name?.firstName +
      (sender?.name?.lastName ? " " + sender.name.lastName : "")
    } requested you to join a group`,
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
