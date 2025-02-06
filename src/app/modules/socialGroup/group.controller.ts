import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { GroupService } from "./group.service";
import httpStatus from "http-status";
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

const addUserToGroup = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { groupId } = req.params;
  const result = await GroupService.addUserToGroup(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User added to group successfully.",
  });
});

const leaveFromGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  const result = await GroupService.leaveFromGroup(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User leaved from group successfully.",
  });
});

const removeUserFromGroup = catchAsync(async (req, res) => {
  const { groupId, userId } = req.params;
  const { userId: adminId } = req.user;
  const result = await GroupService.removeUserFromGroup(
    groupId,
    userId,
    adminId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User removed from group successfully.",
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

const getUserAllGroups = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await GroupService.getUserAllGroups(userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Groups fetched successfully.",
  });
});

const getSingleGroupData = catchAsync(async (req, res) => {
  const { groupId } = req.params;

  const result = await GroupService.getSingleGroupData(groupId);
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
  addUserToGroup,
  leaveFromGroup,
  removeUserFromGroup,
  deleteGroup,
  getUserAllGroups,
  getSingleGroupData,
};
