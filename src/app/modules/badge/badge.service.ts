import AppError from "../../errors/AppError";
import { IBadge } from "./badge.interface";
import Badge from "./badge.model";
import httpStatus from "http-status";
const createBadge = async (data: IBadge) => {
  return await Badge.create(data);
};

const editBadge = async (id: string, data: Partial<IBadge>) => {
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
  const badge = await Badge.findByIdAndDelete(id);
  if (!badge) {
    throw new AppError(httpStatus.NOT_FOUND, "Badge not found");
  }
  return badge;
};
const BadgeService = {
  createBadge,
  getAllBadge,
  editBadge,
  getSingleBadge,
  deleteBadge,
};
export default BadgeService;
