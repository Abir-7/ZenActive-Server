import status from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserGroupService } from "./userGroup.service";

const getUserAllGroups = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { page = 1, limit = 25, searchTerm } = req.query;
  const result = await UserGroupService.getUserAllGroups(
    userId,
    searchTerm as string,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: status.OK,
    message: "Groups fetched successfully.",
  });
});

const addUserToGroup = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { groupId } = req.params;
  const result = await UserGroupService.addUserToGroup(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "User added to group successfully.",
  });
});

const removeUserFromGroup = catchAsync(async (req, res) => {
  const { groupId, userId } = req.params;
  const { userId: adminId } = req.user;
  const result = await UserGroupService.removeUserFromGroup(
    groupId,
    userId,
    adminId
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "User removed from group successfully.",
  });
});

const leaveFromGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  const result = await UserGroupService.leaveFromGroup(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "User leaved from group successfully.",
  });
});
const inviteUserList = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.user;
  const { searchTerm, page = 1, limit = 20 } = req.query;
  const result = await UserGroupService.inviteUserList(
    groupId,
    userId,
    searchTerm as string,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    success: true,
    statusCode: status.OK,
    message: "User list for invite is fetched successfully.",
  });
});

const inviteUser = catchAsync(async (req, res) => {
  const { groupId, receiverId } = req.body;
  const { userId } = req.user;

  const result = await UserGroupService.inviteUser(groupId, userId, receiverId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "Group invite send to user successfully.",
  });
});

export const UserGroupController = {
  getUserAllGroups,
  addUserToGroup,
  removeUserFromGroup,
  leaveFromGroup,
  inviteUserList,
  inviteUser,
};
