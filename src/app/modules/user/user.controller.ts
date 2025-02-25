import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message:
      "Please check your email to verify your account. We have sent you an OTP to complete the registration process.",
  });
});

const updateUserInfo = catchAsync(async (req, res) => {
  const id = req?.user?.userId;
  console.log(req.files);
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

  const result = await UserService.updateUser(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "User info successfully updated.",
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    data: users.result,
    meta: users.meta,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Users retrieved successfully.",
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const user = await UserService.getSingleUser(userId);

  sendResponse(res, {
    data: user,
    success: true,
    statusCode: HttpStatus.OK,
    message: "User retrieved successfully.",
  });
});

const getMydata = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const user = await UserService.getSingleUser(userId);

  sendResponse(res, {
    data: user,
    success: true,
    statusCode: HttpStatus.OK,
    message: "User retrieved successfully.",
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.deleteUser(userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.NO_CONTENT,
    message: "User deleted successfully.",
  });
});

const blockUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.blockUser(userId);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "User deleted successfully.",
  });
});
const getTotalUserCount = catchAsync(async (req, res) => {
  const result = await UserService.getTotalUserCount();

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Total user number fetched successfully.",
  });
});

export const UserController = {
  createUser,
  blockUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserInfo,
  getMydata,
  getTotalUserCount,
};
