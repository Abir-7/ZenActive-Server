import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { calculateTDEE } from "../../utils/calculateTDEE";
import generateOTP from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import unlinkFile from "../../utils/unlinkFiles";
import { UserAppData } from "../userAppData/appdata.model";
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
  const users = new QueryBuilder(
    User.find({ isDeleted: false, role: "USER" }).populate("appData"),
    query
  )
    .search(["name.firstName", "name.lastName", "email"])
    .paginate();
  const result = await users.modelQuery;
  return result;
};

const getSingleUser = async (userId: string) => {
  const user = await User.findOne({ _id: userId }).populate("appData");

  if (user?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }
  return user;
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

export const UserService = {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  blockUser,
};
