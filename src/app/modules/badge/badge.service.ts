import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import unlinkFile from "../../utils/unlinkFiles";
import { UserAppData } from "../userAppData/appdata.model";

import { IBadge } from "./badge.interface";
import Badge from "./badge.model";
import httpStatus, { status } from "http-status";
const createBadge = async (data: IBadge) => {
  const badge = await Badge.create(data);

  if (!badge) {
    unlinkFile(data.image);
  }
  return badge;
};

const editBadge = async (id: string, data: Partial<IBadge>) => {
  const badgeData = await Badge.findById(id);
  // if (!data.points && !data.image && !data.points) {
  //   throw new AppError(status.BAD_REQUEST, "Give Data");
  // }
  if (!badgeData) {
    throw new AppError(404, "Badge not found.");
  }

  if (data.image && badgeData) {
    unlinkFile(badgeData?.image);
  }
  if (data.image && !badgeData) {
    unlinkFile(data.image);
  }

  const badge = await Badge.findByIdAndUpdate(id, data, { new: true });
  if (!badge) {
    throw new Error("Badge not found");
  }
  return badge;
};

// const getAllBadge = async (query: Record<string, unknown>) => {
//   const badege = new QueryBuilder(Badge.find({ isDeleted: false }), query)
//     .sort()
//     .paginate();

//   const result = await badege.modelQuery;
//   const meta = await badege.countTotal();

//   return { result, meta };
// };

const getAllBadge = async (query: Record<string, unknown>, userId: string) => {
  // Fetch the user's current points
  const userAppData = await UserAppData.findOne({ userId });
  const userPoints = userAppData?.points || 0;

  // Query badges
  const badgeQuery = new QueryBuilder(Badge.find({ isDeleted: false }), query)
    .sort()
    .paginate();

  const badges = await badgeQuery.modelQuery;
  const meta = await badgeQuery.countTotal();

  // Add isEligibleToClaim field
  const result = badges.map((badge) => ({
    ...badge.toObject(),
    isEligibleToClaim: userPoints >= badge.points,
  }));

  return { result, meta };
};

const getSingleBadge = async (id: string) => {
  const data = await Badge.findOne({ _id: id, isDeleted: false });
  if (!data) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not found");
  }
  return data;
};

const deleteBadge = async (id: string) => {
  const badge = await Badge.findById(id);
  if (!badge) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not found");
  }
  const deleteBadge = await Badge.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!deleteBadge) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not deleted.");
  }
  return deleteBadge;
};
const BadgeService = {
  createBadge,
  getAllBadge,
  editBadge,
  getSingleBadge,
  deleteBadge,
};
export default BadgeService;
