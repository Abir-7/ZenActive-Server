import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { GroupService } from "./group.service";
import sendResponse from "../../../utils/sendResponse";

const createGroup = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const groupData = req.body;

  const result = await GroupService.createGroup(groupData, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Group created successfully.",
  });
});

const getAllGroup = catchAsync(async (req, res) => {
  const result = await GroupService.getAllGroup();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "All Public Group fetched successfully.",
  });
});

const updateGroup = catchAsync(async (req, res) => {
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

  const { groupId } = req.params;

  const { userId } = req.user;
  const result = await GroupService.updateGroup(groupId, userId, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Group updated successfully.",
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  await GroupService.deleteGroup(groupId, userId);
  sendResponse(res, {
    data: null,
    success: true,
    statusCode: httpStatus.OK,
    message: "Group deleted successfully.",
  });
});

const getSingleGroupData = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  const result = await GroupService.getSingleGroupData(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Group data fetched successfully.",
  });
});
export const GroupController = {
  createGroup,
  updateGroup,
  deleteGroup,
  getSingleGroupData,
  getAllGroup,
};
