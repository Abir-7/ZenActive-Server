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

// const getAllUsers = async (query: Record<string, unknown>) => {
//   query.isDeleted = false;
//   query.isBlocked = false;

//   const users = new QueryBuilder(User.find(), query)
//     .search(["name.firstName", "name.lastName", "email"])
//     .filter()
//     .paginate();

//   const result1 = await users.modelQuery;
//   const meta = await users.countTotal();

//   const result = await Promise.all(
//     result1.map(async (user) => {
//       const appData = await UserAppData.find({ userId: user._id }).exec();
//       return {
//         ...user.toObject(), // Convert Mongoose document to plain object
//         appData, // Attach appData to the user
//       };
//     })
//   );

//   console.log(meta);
//   return { result, meta };
// };

// const getSingleUser = async (userId: string) => {
//   const [user, badges, appData] = await Promise.all([
//     User.findOne({ _id: userId }), // User data
//     UserBadge.findOne({ userId }).populate("badgeId"), // Badges
//     UserAppData.findOne({ userId }), // App data
//   ]);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   if (user.isBlocked) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
//   }

//   if (user.isDeleted) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
//   }

//   return {
//     user,
//     appData,
//     badges,
//   };
// };

const getAllUsers = async (query: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}) => {
  query.isDeleted = false;
  query.isBlocked = false;

  const { searchTerm, page = 1, limit = 10, ...filterQuery } = query;

  const searchFilter = searchTerm
    ? {
        $or: [
          { "name.firstName": { $regex: searchTerm, $options: "i" } },
          { "name.lastName": { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  const combinedQuery = {
    ...filterQuery,
    ...searchFilter,
    isDeleted: false,
    isBlocked: false,
  };

  const users = await User.aggregate([
    { $match: combinedQuery },

    {
      $lookup: {
        from: "userappdatas",
        localField: "_id",
        foreignField: "userId",
        as: "appData",
      },
    },
    {
      $unwind: {
        path: "$appData",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },

    {
      $project: {
        isVerified: 1,
        authentication: 1,
        _id: 1,
        isProfileUpdated: 1,
        role: 1,
        isDeleted: 1,
        isBlocked: 1,
        name: 1,
        image: 1,
        email: 1,
        appData: 1,

        dateOfBirth: 1,
        diet: 1,
        gender: 1,
        height: 1,
        weight: 1,
        primaryGoal: 1,
        movementDifficulty: 1,
        medicalCondition: 1,
        injury: 1,
        activityLevel: 1,
      },
    },
  ]);

  const totalUsers = await User.countDocuments(combinedQuery);

  return {
    meta: {
      total: totalUsers,
      totalPage: Math.ceil(totalUsers / limit),
      page,
      limit,
    },
    result: users,
  };
};

const getSingleUser = async (userId: string) => {
  const result = await User.aggregate([
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
        localField: "_id",
        foreignField: "userId",
        as: "appData",
      },
    },

    {
      $addFields: {
        badges: { $arrayElemAt: ["$badges", 0] },
        appData: { $arrayElemAt: ["$appData", 0] },
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        role: 1,
        isBlocked: 1,
        isDeleted: 1,
        badges: 1, // This is now an object
        appData: 1, // This is now an object
      },
    },
  ]);

  // Check if the user exists
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const user = result[0];

  // Check for user status
  if (user.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  // Return the populated user with badge and app data
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
