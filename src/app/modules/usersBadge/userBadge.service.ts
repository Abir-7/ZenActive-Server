import { Types } from "mongoose";
import { UserBadge } from "./userBadge.model";
import Badge from "../badge/badge.model";
import AppError from "../../errors/AppError";
import { UserAppData } from "../userAppData/appdata.model";

const createOrUpdateUserBadge = async (
  userId: Types.ObjectId,
  badgeId: Types.ObjectId
): Promise<any> => {
  const appdata = await UserAppData.findOne({ userId });
  console.log(appdata);
  const isExist = await Badge.findOne({
    _id: badgeId,
    isDeleted: false,
  });

  console.log(isExist?.points);

  if (!isExist) {
    throw new AppError(404, "Badge not found.");
  }

  if (appdata?.points && appdata?.points < isExist?.points) {
    throw new AppError(404, "You have not enough points.");
  }

  // Check if the user-badge relationship already exists
  const existingUserBadge = await UserBadge.findOne({ userId }).exec();

  if (existingUserBadge) {
    // If it exists, update the badgeId
    existingUserBadge.badgeId = badgeId;
    return await existingUserBadge.save();
  } else {
    // If it doesn't exist, create a new user-badge relationship
    const userBadge = new UserBadge({ userId, badgeId });
    return await userBadge.save();
  }
};
const getUserBadgeById = async (userId: string): Promise<any | null> => {
  const data = await UserBadge.findOne({ userId }).populate("badgeId").exec();
  return data;
};

export const UserBadgeService = {
  createOrUpdateUserBadge,

  getUserBadgeById,
};
