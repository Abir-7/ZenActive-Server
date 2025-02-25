import status from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserGroupService } from "./userGroup.service";

const getUserAllGroups = catchAsync(async (req, res) => {
  console.log("object");
  const { userId } = req.user;
  const result = await UserGroupService.getUserAllGroups(
    userId,
    req.query.searchTerm as string
  );
  sendResponse(res, {
    data: result,
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

  const result = await UserGroupService.inviteUserList(groupId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "User list for invite is fetched successfully.",
  });
});

export const UserGroupController = {
  getUserAllGroups,
  addUserToGroup,
  removeUserFromGroup,
  leaveFromGroup,
  inviteUserList,
};
