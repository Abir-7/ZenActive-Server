import AppError from "../../errors/AppError";
import { IChallenge } from "./challenge.interface";
import { Challenge } from "./challenge.model";
import httpStatus from "http-status";
const createChallenge = async (data: IChallenge) => {
  const result = await Challenge.create(data);
  return result;
};
const updateChallenge = async (id: string, data: Partial<IChallenge>) => {
  const isExist = await Challenge.findById({ _id: id });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Challange not found.");
  }
  const updatedData = await Challenge.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  if (!updatedData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update.");
  }
  return updatedData;
};

const getAllChallenges = async () => {
  const challenges = await Challenge.find({ isDeleted: false });
  return challenges;
};

const getSingleChallenge = async (id: string) => {
  const challenge = await Challenge.findById(id);

  if (!challenge) {
    throw new AppError(httpStatus.NOT_FOUND, "Challenge not found.");
  }
  if (challenge.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Challenge is deleted.");
  }

  return challenge;
};

const deleteChallenge = async (id: string) => {
  const deletedChallenge = await Challenge.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedChallenge) {
    throw new AppError(httpStatus.NOT_FOUND, "Challenge not found.");
  }

  return { message: "Challenge deleted" };
};

export const ChallegeService = {
  createChallenge,
  getAllChallenges,
  getSingleChallenge,
  updateChallenge,
  deleteChallenge,
};
