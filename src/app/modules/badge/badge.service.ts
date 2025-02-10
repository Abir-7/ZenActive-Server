import AppError from "../../errors/AppError";
import unlinkFile from "../../utils/unlinkFiles";
import { IBadge } from "./badge.interface";
import Badge from "./badge.model";
import httpStatus from "http-status";
const createBadge = async (data: IBadge) => {
  const badge = await Badge.create(data);

  if (!badge) {
    unlinkFile(data.image);
  }
  return badge;
};

const editBadge = async (id: string, data: Partial<IBadge>) => {
  const badgeData = await Badge.findById(id);

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

const getAllBadge = async () => {
  return await Badge.find({ isDeleted: false });
};

const getSingleBadge = async (id: string) => {
  return await Badge.findOne({ _id: id, isDeleted: false });
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
