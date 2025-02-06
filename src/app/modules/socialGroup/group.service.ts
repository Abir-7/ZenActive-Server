import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { IGroup } from "./group.interface";
import { Group } from "./group.model";
import httpStatus from "http-status";
import Post from "../blog/post/post.model";
import Like from "../blog/likes/like.model";
import Comment from "../blog/comments/comment.model";
const createGroup = async (groupData: IGroup, userId: string) => {
  const group = await Group.create({
    ...groupData,
    users: [userId],
    admin: userId,
  });
  return group;
};

const updateGroup = async (
  groupId: string,
  userId: string,
  updateData: Partial<IGroup>
) => {
  const result = await Group.findOneAndUpdate(
    { _id: groupId, admin: userId, isDeleted: false },
    updateData,
    { new: true }
  )
    .populate({ path: "users", select: "name email _id image" })
    .exec();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Group update failed.");
  }
  return result;
};

const addUserToGroup = async (groupId: string, userId: string) => {
  const group = await Group.findOne({ _id: groupId, isDeleted: false }).exec();
  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, " Group not found");
  }
  if (group.users.some((id) => id.equals(userId))) {
    throw new AppError(httpStatus.BAD_REQUEST, "User alreadyu added.");
  }
  group.users.push(new Types.ObjectId(userId));
  const updatedGroup = await group.save();
  return updatedGroup;
};

const leaveFromGroup = async (groupId: string, userId: string) => {
  const isAdmin = await Group.findOne({ admin: userId });
  if (isAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are admin. can't leave group."
    );
  }
  const updatedGroup = await Group.findOneAndUpdate(
    { _id: groupId, isDeleted: false },
    { $pull: { user: userId } },
    { new: true }
  );

  if (!updatedGroup) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to remove user from group: either the group does not exist or you are not authorized as admin"
    );
  }

  return updatedGroup;
};

const removeUserFromGroup = async (
  groupId: string,
  userId: string,
  adminId: string
) => {
  if (adminId === userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are admin. can't remove from the group."
    );
  }

  const updatedGroup = await Group.findOneAndUpdate(
    { _id: groupId, admin: adminId, isDeleted: false },
    { $pull: { user: userId } },
    { new: true }
  );

  if (!updatedGroup) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to remove user from group: either the group does not exist or you are not authorized as admin"
    );
  }
  return updatedGroup;
};

const deleteGroup = async (groupId: string, userId: string) => {
  const isAdmin = await Group.findOne({ _id: groupId, admin: userId });
  if (!isAdmin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Only admin can delete group");
  }
  const deletedGroup = await Group.findByIdAndUpdate(groupId, {
    isDeleted: true,
  }).exec();
  if (!deletedGroup) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete group"
    );
  }

  return { message: "Group deleted." };
};

const getUserAllGroups = async (userId: string) => {
  const groups = await Group.find({
    isDeleted: false,
    users: { $in: [userId] },
  }).exec();

  return groups;
};

const getSingleGroupData = async (groupId: string) => {
  const group = await Group.find({
    isDeleted: false,
    _id: groupId,
  });

  return group;
};

export const GroupService = {
  createGroup,
  updateGroup,
  addUserToGroup,
  removeUserFromGroup,
  leaveFromGroup,
  deleteGroup,
  getUserAllGroups,
  getSingleGroupData,
};
