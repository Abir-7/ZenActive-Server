import mongoose, { Types } from "mongoose";

import { IGroup } from "./group.interface";
import { Group } from "./group.model";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { UserGroup } from "../UsersGroup/userGroup.model";
import Post from "../../blog/post/post.model";

const createGroup = async (groupData: IGroup, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const group = await Group.create([{ ...groupData, admin: userId }], {
      session,
    });

    if (!group || !group[0]?._id) {
      throw new Error("Group creation failed");
    }

    await UserGroup.create(
      [{ groupId: group[0]._id, userId: group[0].admin }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return group[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, "Faild to create group.");
  }
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
const getAllGroup = async (userId: string, searchText?: string) => {
  try {
    const filter: any = { type: "Public" };

    if (searchText) {
      const searchRegex = new RegExp(searchText, "i");
      filter.$or = [{ name: searchRegex }, { goal: searchRegex }];
    }

    const groups = await Group.aggregate([
      {
        $match: filter, // Get only public groups
      },
      {
        $lookup: {
          from: "usergroups", // Join with UserGroup collection
          localField: "_id",
          foreignField: "groupId",
          as: "members",
        },
      },
      {
        $addFields: {
          totalMembers: { $size: "$members" }, // Count total members
          userJoined: {
            $in: [new mongoose.Types.ObjectId(userId), "$members.userId"],
          }, // Check if user is a member
        },
      },
      {
        $match: { userJoined: false }, // Exclude groups where user has joined
      },
      {
        $project: {
          members: 0, // Exclude members array from response
          userJoined: 0, // Remove extra field
        },
      },
    ]);

    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
};

const getSingleGroupData = async (groupId: string, userId: string) => {
  const groupData = await Group.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(groupId),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "usergroups", // Collection name of UserGroupModel (MongoDB converts 'UserGroup' -> 'usergroups')
        localField: "_id",
        foreignField: "groupId",
        as: "members",
      },
    },
    {
      $match: {
        "members.userId": new Types.ObjectId(userId), // Ensure the user is a member
      },
    },
    {
      $addFields: {
        totalMembers: { $size: "$members" }, // Count total members in the group
      },
    },
    {
      $project: {
        members: 0, // Exclude detailed members array if not needed
      },
    },
  ]);

  if (!groupData.length) {
    throw new Error("Group not found or user is not a member.");
  }

  const totalPost = await Post.find({
    groupId,
    isDelete: false,
  }).estimatedDocumentCount();
  await UserGroup.findOneAndUpdate(
    { userId, groupId },
    { previousTotalPost: totalPost, newPost: 0 }
  );

  return groupData[0];
};

export const GroupService = {
  createGroup,
  updateGroup,
  deleteGroup,
  getSingleGroupData,
  getAllGroup,
};
