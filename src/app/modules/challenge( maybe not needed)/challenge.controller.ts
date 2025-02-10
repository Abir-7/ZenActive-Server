import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChallegeService } from "./challenge.service";
import httpStatus from "http-status";
const createChallenge = catchAsync(async (req, res) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };

  const result = await ChallegeService.createChallenge(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Challenge created successfully.",
  });
});

const updateChallenge = catchAsync(async (req, res) => {
  const id = req.params.id;
  let image = null;
  let value = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  if (image) {
    value = {
      ...req.body,
      image,
    };
  } else {
    value = req.body;
  }
  const result = await ChallegeService.updateChallenge(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Challenge updated successfully.",
  });
});

const getAllChallenges = catchAsync(async (req, res) => {
  const challenges = await ChallegeService.getAllChallenges();
  sendResponse(res, {
    data: challenges,
    success: true,
    statusCode: httpStatus.OK,
    message: "Challenges fetched successfully.",
  });
});
const getSingleChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const challenge = await ChallegeService.getSingleChallenge(id);
  sendResponse(res, {
    data: challenge,
    success: true,
    statusCode: httpStatus.OK,
    message: "Challenge fetched successfully.",
  });
});

const deleteChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedChallenge = await ChallegeService.deleteChallenge(id);
  sendResponse(res, {
    data: deletedChallenge,
    success: true,
    statusCode: httpStatus.OK,
    message: "Challenge deleted successfully.",
  });
});

export const ChallengeController = {
  createChallenge,
  updateChallenge,
  getAllChallenges,
  getSingleChallenge,
  deleteChallenge,
};
