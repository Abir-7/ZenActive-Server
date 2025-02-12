import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

import BadgeService from "./badge.service";

const createBadge = catchAsync(async (req, res) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };

  const result = await BadgeService.createBadge(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Badge successfully created.",
  });
});

const editBadge = catchAsync(async (req, res) => {
  const { id } = req.params;

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

  const result = await BadgeService.editBadge(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Badge successfully updated.",
  });
});

const getAllBadge = catchAsync(async (req, res) => {
  const result = await BadgeService.getAllBadge(req.query);
  sendResponse(res, {
    data: result.result,
    meta: result.meta,
    success: true,
    statusCode: httpStatus.OK,
    message: "Badges are successfully fetched.",
  });
});

const getSingleBadge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BadgeService.getSingleBadge(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Badge is successfully fetched.",
  });
});

const deleteBadge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BadgeService.deleteBadge(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Badge successfully deleted.",
  });
});

export const BadgeController = {
  createBadge,
  editBadge,
  getSingleBadge,
  getAllBadge,
  deleteBadge,
};
