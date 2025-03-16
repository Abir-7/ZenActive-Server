import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { AuthService } from "./auth.service";
import { config } from "../../config";
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.server.environment === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    data: { token: result.accessToken, user: result.user },
    success: true,
    statusCode: HttpStatus.OK,
    message: "Login Successful.",
  });
});

const forgotPass = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPass(email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Verification code sent to email.",
  });
});

const verifyUser = catchAsync(async (req, res) => {
  const result = await AuthService.verifyUser(req.body);
  sendResponse(res, {
    data: result.data,
    success: true,
    statusCode: HttpStatus.OK,
    message: result.message,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthService.resetPassword(token as string, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Password reset successfully",
  });
});

const reSendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.reSendOtp(email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Verification Code send successfully",
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.updatePassword(userId, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "Password updated successfully",
  });
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await AuthService.getNewAccessToken(
    refreshToken,
    req.params.email as string
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: HttpStatus.OK,
    message: "New access-token is created.",
  });
});

export const AuthController = {
  loginUser,
  forgotPass,
  resetPassword,
  verifyUser,
  reSendOtp,
  updatePassword,
  getNewAccessToken,
};
