import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { calculateTDEE } from "../../utils/calculateTDEE";
import generateOTP from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import unlinkFile from "../../utils/unlinkFiles";
import Badge from "../badge/badge.model";
import { UserAppData } from "../userAppData/appdata.model";
import { UserBadge } from "../usersBadge/userBadge.model";
import { IUpdateUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
const createUser = async (userData: {
  email: string;
  password: string;
  confirm_password: string;
  fcmToken: string;
}) => {
  const isExist = await User.findOne({ email: userData.email });
  if (isExist) {
    throw new AppError(400, "User already exist");
  }

  //check password
  if (userData.password !== userData.confirm_password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not match.");
  }
  //create otp
  const OTP = generateOTP();
  //create user
  const result = await User.create({
    email: userData.email,
    password: userData.password,
    fcmToken: userData.fcmToken,
    "authentication.oneTimeCode": OTP,
    "authentication.expireAt": new Date(Date.now() + 10 * 60 * 1000), //10min,
  });

  if (result) {
    //send email
    sendEmail(userData.email, "Email Verification Code", `CODE: ${OTP}`);

    return { userId: result._id, userEmail: result.email };
  } else {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Faild to create user."
    );
  }
};

const updateUser = async (userId: string, userData: IUpdateUser) => {
  // Check if the user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Failed to update. User not found."
    );
  }

  // Destructure userData for easier access
  const {
    medicalCondition,
    movementDifficulty,
    injury,
    activityLevel,
    diet,
    primaryGoal,
    weight,
    height,
    gender,
    dateOfBirth,
    name,
  } = userData;

  const isProfileComplete =
    medicalCondition &&
    movementDifficulty &&
    injury &&
    activityLevel &&
    diet &&
    primaryGoal &&
    typeof weight === "number" &&
    typeof height === "number" &&
    gender &&
    dateOfBirth &&
    name?.firstName &&
    name?.lastName &&
    !isUserExist.isProfileUpdated;

  let appData;

  // Calculate TDEE and create/update UserAppData if the profile is complete
  if (isProfileComplete) {
    const tdee = calculateTDEE(userData).toFixed(2);
    appData = await UserAppData.findOneAndUpdate(
      { userId },
      { tdee },
      { upsert: true, new: true }
    );
  }

  unlinkFile(isUserExist?.image);

  // Update the user with the provided data
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      ...userData,
      isProfileUpdated: isProfileComplete || isUserExist.isProfileUpdated,
      appData: appData?._id,
    },
    { new: true }
  );

  return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  query.isDeleted = false;
  query.isBlocked = false;
  const users = new QueryBuilder(User.find().populate("appData"), query)
    .search(["name.firstName", "name.lastName", "email"])
    .filter()
    .paginate();
  const result = await users.modelQuery;
  const meta = await users.countTotal();
  console.log(meta);
  return { result, meta };
};

const getSingleUser = async (userId: string) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "userbadges",
        localField: "_id",
        foreignField: "userId",
        as: "badges",
      },
    },
    {
      $lookup: {
        from: "badges",
        localField: "badges.badgeId",
        foreignField: "_id",
        as: "badges",
      },
    },
    {
      $lookup: {
        from: "userappdatas",
        localField: "appData",
        foreignField: "_id",
        as: "appData",
      },
    },
    { $unwind: { path: "$appData", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$badges", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        password: 0,
        authentication: 0,
      },
    },
  ]);

  if (!user || user.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user[0].isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
  }

  if (user[0].isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  return user[0];
};

const deleteUser = async (userId: string) => {
  const isUserDeleted = await User.findOne({ _id: userId });
  if (isUserDeleted?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already  deleted");
  }
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { isDeleted: true },
    { new: true }
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  return { message: "User deleted successfully." };
};

const blockUser = async (userId: string) => {
  const isUserblocked = await User.findOne({ _id: userId });
  if (isUserblocked?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { isBlocked: true },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  return { message: "User deleted successfully." };
};

const getTotalUserCount = async () => {
  const totalUsers = await User.countDocuments({
    isDeleted: false,
    isBlocked: false,
  });
  return { totalUsers };
};

export const UserService = {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  blockUser,
  getTotalUserCount,
};
