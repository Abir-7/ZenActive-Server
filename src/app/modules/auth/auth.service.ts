import { config } from "../../config";
import AppError from "../../errors/AppError";
import cryptoToken from "../../utils/cryptoToken";
import generateOTP from "../../utils/generateOtp";
import { jwtHelper } from "../../utils/jwtHelper";
import { sendEmail } from "../../utils/sendEmail";
import { ResetToken } from "../resetToken/resetToken.model";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
const loginUser = async (userData: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  const isUserExist = await User.findOne({ email: userData.email }).select(
    "+password"
  );

  if (isUserExist?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Blocked");
  }
  if (isUserExist?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Deleted");
  }
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Please check your email.");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.NOT_FOUND, "Please verify your email.");
  }

  if (!(await User.passwordMatch(isUserExist.password, userData.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not matched.");
  }
  console.log(userData.fcmToken, "<<>>", isUserExist.fcmToken, "1");
  if (isUserExist.fcmToken !== userData.fcmToken) {
    console.log(userData.fcmToken, "<<>>", isUserExist.fcmToken);

    await User.findOneAndUpdate(
      { email: userData.email },
      { fcmToken: userData.fcmToken },
      { new: true }
    );
  }

  const jwtPayload = {
    userEmail: isUserExist.email,
    userId: isUserExist._id,
    userRole: isUserExist.role,
    hasPremiumAccess: isUserExist.hasPremiumAccess,
  };

  const accessToken = jwtHelper.generateToken(
    jwtPayload,
    config.security.jwt.secret as string,
    config.security.jwt.refreshExpiresIn
  );

  const refreshToken = jwtHelper.generateToken(
    jwtPayload,
    config.security.jwt.refreshSecret as string,
    config.security.jwt.refreshExpiresIn
  );
  return {
    accessToken,
    refreshToken,
    user: isUserExist,
  };
};

const verifyUser = async (userData: { email: string; code: number }) => {
  const user = await User.findOne({ email: userData.email }).select(
    "+authentication"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!Number(userData.code)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please give the otp, check your email."
    );
  }

  if (user?.authentication?.oneTimeCode !== Number(userData.code)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Code not matched.");
  }

  if (user?.authentication?.expireAt <= new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Code has expired");
  }

  if (!user.isVerified) {
    const result = await User.findOneAndUpdate(
      { email: userData.email },
      {
        $set: {
          isVerified: true,
          "authentication.oneTimeCode": null,
          "authentication.expireAt": null,
        },
      },
      { new: true }
    );
    return {
      data: result?.email,
      message: "Email verification successful.",
    };
  } else {
    const updatedData = {
      isResetPassword: true,
      oneTimeCode: null,
      expireAt: null,
    };

    await User.findOneAndUpdate(
      { email: userData.email },
      {
        authentication: updatedData,
      },
      { new: true }
    );

    const createToken = cryptoToken();
    await ResetToken.create({
      user: user._id,
      token: createToken,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return {
      data: createToken,
      message:
        "Verification Successful: Please securely store and utilize this code for reset password",
    };
  }
};

const forgotPass = async (userEmail: string) => {
  const isUserExist = await User.findOne({ email: userEmail });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Email not found.");
  }

  const OTP = generateOTP();

  await sendEmail(
    userEmail,
    "Reset Password Verification Code",
    `CODE: ${OTP}`
  );

  const updatedData = {
    isResetPassword: false,
    oneTimeCode: OTP,
    expireAt: new Date(Date.now() + 10 * 60 * 1000), //10min
  };

  await User.findOneAndUpdate(
    { email: userEmail },
    {
      authentication: updatedData,
    }
  );

  return { userEmail };
};

const resetPassword = async (
  token: string,
  userData: {
    new_password: string;
    confirm_password: string;
  }
) => {
  const { new_password, confirm_password } = userData;

  const isExistToken = await ResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const isUserExist = await User.findOne({ _id: isExistToken.user }).select(
    "+authentication"
  );

  if (!isUserExist?.authentication?.isResetPassword) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Token expired, Please click again to the forget password"
    );
  }

  //check password
  if (new_password !== confirm_password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }
  const hashPassword = await bcrypt.hash(
    new_password,
    Number(config.security.bcryptSaltRounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });

  return "Password changed.";
};

const reSendOtp = async (userEmail: string) => {
  const OTP = generateOTP();

  const updateUser = await User.findOneAndUpdate(
    { email: userEmail },
    {
      $set: {
        "authentication.oneTimeCode": OTP,
        "authentication.expireAt": new Date(Date.now() + 10 * 60 * 1000), //10min
      },
    },
    { new: true }
  );

  if (!updateUser) {
    throw new AppError(500, "Failed to Send. Try Again!");
  }

  await sendEmail(userEmail, "Verification Code", `CODE: ${OTP}`);
  return { message: "Verification Send" };
};

const updatePassword = async (
  userId: string,
  passData: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }
) => {
  const isUserExist = await User.findOne({ _id: userId }).select("+password");

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }
  if (isUserExist?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Blocked");
  }
  if (isUserExist?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Deleted");
  }

  if (
    !(await User.passwordMatch(isUserExist.password, passData.old_password))
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not matched.");
  }

  if (passData.new_password !== passData.confirm_password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not matched.");
  }

  const hashPassword = await bcrypt.hash(
    passData.new_password,
    Number(config.security.bcryptSaltRounds)
  );

  const udpatePass = await User.findOneAndUpdate(
    { _id: userId },
    {
      password: hashPassword,
    },
    { new: true }
  );
  if (!udpatePass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update password.");
  }

  return { message: "Password changed." };
};

const getNewAccessToken = async (refreshToken: string, email: string) => {
  console.log(email);
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found.");
  }
  const decode = jwtHelper.verifyToken(
    refreshToken,
    config.security.jwt.refreshSecret as string
  );

  const { userEmail, userId, userRole } = decode;
  console.log(userEmail);
  if (userEmail !== email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized.");
  }

  if (userEmail && userId && userRole) {
    const jwtPayload = {
      userEmail: userEmail,
      userId: userId,
      userRole: userRole,
    };

    const accessToken = jwtHelper.generateToken(
      jwtPayload,
      config.security.jwt.secret as string,
      config.security.jwt.expireIn
    );

    return { accessToken };
  } else {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized.");
  }
};

export const AuthService = {
  loginUser,
  forgotPass,
  verifyUser,
  resetPassword,
  reSendOtp,
  updatePassword,
  getNewAccessToken,
};
