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
  const isUserExist = await User.findOne({ email: userData.email })
    .select("+password")
    .populate("appData");

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

  if (isUserExist.fcmToken !== userData.fcmToken) {
    await User.findOneAndUpdate(
      { email: userData.email },
      { fcmToken: userData.fcmToken },
      { new: true }
    );
  }
  console.log("hit");
  const jwtPayload = {
    userEmail: isUserExist.email,
    userId: isUserExist._id,
    userRole: isUserExist.role,
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
    user: {
      email: isUserExist.email,
      role: isUserExist.role,
      _id: isUserExist._id,
    },
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

export const AuthService = {
  loginUser,
  forgotPass,
  verifyUser,
  resetPassword,
  reSendOtp,
};
