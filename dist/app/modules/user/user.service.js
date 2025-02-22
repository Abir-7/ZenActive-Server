"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const calculateTDEE_1 = require("../../utils/calculateTDEE");
const generateOtp_1 = __importDefault(require("../../utils/generateOtp"));
const sendEmail_1 = require("../../utils/sendEmail");
const unlinkFiles_1 = __importDefault(require("../../utils/unlinkFiles"));
const appdata_model_1 = require("../userAppData/appdata.model");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: userData.email });
    if (isExist) {
        throw new AppError_1.default(400, "User already exist");
    }
    //check password
    if (userData.password !== userData.confirm_password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password not match.");
    }
    //create otp
    const OTP = (0, generateOtp_1.default)();
    //create user
    const result = yield user_model_1.User.create({
        email: userData.email,
        password: userData.password,
        fcmToken: userData.fcmToken,
        "authentication.oneTimeCode": OTP,
        "authentication.expireAt": new Date(Date.now() + 10 * 60 * 1000), //10min,
    });
    if (result) {
        //send email
        (0, sendEmail_1.sendEmail)(userData.email, "Email Verification Code", `CODE: ${OTP}`);
        return { userId: result._id, userEmail: result.email };
    }
    else {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to create user.");
    }
});
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Start a Mongoose session and begin a transaction
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Fetch the user record within the transaction
        const existingUser = yield user_model_1.User.findById(userId).session(session);
        if (!existingUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to update. User not found.");
        }
        // Destructure userData for easier access
        const { medicalCondition, movementDifficulty, injury, activityLevel, diet, primaryGoal, weight, height, gender, dateOfBirth, restriction, name, } = userData;
        // Determine if the profile is complete (and not already updated)
        const isProfileComplete = restriction &&
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
            (name === null || name === void 0 ? void 0 : name.firstName) &&
            (name === null || name === void 0 ? void 0 : name.lastName) &&
            !existingUser.isProfileUpdated;
        let appData;
        if (isProfileComplete && existingUser.role === "USER") {
            const { tdee, dailyWorkoutTime } = (0, calculateTDEE_1.calculateTDEE)(userData);
            appData = yield appdata_model_1.UserAppData.findOneAndUpdate({ userId }, { tdee: tdee.toFixed(2), workoutTime: dailyWorkoutTime }, { upsert: true, new: true, session });
        }
        if (!isProfileComplete &&
            existingUser.role === "USER" &&
            (weight != null ||
                height != null ||
                dateOfBirth != null ||
                gender != null ||
                activityLevel != null ||
                primaryGoal != null)) {
            // Use the provided values if available; otherwise, fall back to existingUser data.
            const updatedProfile = {
                weight: weight !== null && weight !== void 0 ? weight : existingUser.weight,
                height: height !== null && height !== void 0 ? height : existingUser.height,
                dateOfBirth: dateOfBirth !== null && dateOfBirth !== void 0 ? dateOfBirth : existingUser.dateOfBirth,
                gender: gender !== null && gender !== void 0 ? gender : existingUser.gender,
                activityLevel: activityLevel !== null && activityLevel !== void 0 ? activityLevel : existingUser.activityLevel,
                primaryGoal: primaryGoal !== null && primaryGoal !== void 0 ? primaryGoal : existingUser.primaryGoal,
            };
            // Calculate TDEE using the updated profile data.
            const { tdee, dailyWorkoutTime } = (0, calculateTDEE_1.calculateTDEE)(updatedProfile);
            // Update the user's application data.
            appData = yield appdata_model_1.UserAppData.findOneAndUpdate({ userId }, { tdee: tdee.toFixed(2), workoutTime: dailyWorkoutTime }, { upsert: true, new: true, session });
        }
        // Remove the user's previous image file (consider if this should happen post-transaction)
        if (userData.image) {
            (0, unlinkFiles_1.default)(existingUser.image);
        }
        // Update the user document with the provided data and new appData reference
        const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: userId }, Object.assign(Object.assign({}, userData), { isProfileUpdated: isProfileComplete || existingUser.isProfileUpdated, appData: appData === null || appData === void 0 ? void 0 : appData._id }), { new: true, session });
        // Commit the transaction if all operations were successful
        yield session.commitTransaction();
        return updatedUser;
    }
    catch (error) {
        // Abort the transaction on error
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
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
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query.isDeleted = false;
    query.isBlocked = false;
    const { searchTerm, page = 1, limit = 10 } = query, filterQuery = __rest(query, ["searchTerm", "page", "limit"]);
    const searchFilter = searchTerm
        ? {
            $or: [
                { "name.firstName": { $regex: searchTerm, $options: "i" } },
                { "name.lastName": { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ],
        }
        : {};
    const combinedQuery = Object.assign(Object.assign(Object.assign({}, filterQuery), searchFilter), { isDeleted: false, isBlocked: false });
    const users = yield user_model_1.User.aggregate([
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
                _id: 1,
                role: 1,
                isDeleted: 1,
                isBlocked: 1,
                name: 1,
                image: 1,
                email: 1,
                appData: 1,
                isProfileUpdated: 1,
                authentication: 1,
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
    const totalUsers = yield user_model_1.User.countDocuments(combinedQuery);
    return {
        meta: {
            total: totalUsers,
            totalPage: Math.ceil(totalUsers / limit),
            page,
            limit,
        },
        result: users,
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(userId) } },
        // Lookup userAppData
        {
            $lookup: {
                from: "userappdatas", // Collection name in MongoDB
                localField: "_id",
                foreignField: "userId",
                as: "userAppData",
            },
        },
        // Lookup userMealData and populate mealId
        {
            $lookup: {
                from: "usermealplans",
                localField: "_id",
                foreignField: "userId",
                as: "userMealData",
            },
        },
        {
            $lookup: {
                from: "meals",
                localField: "userMealData.mealId",
                foreignField: "_id",
                as: "meals",
            },
        },
        // Lookup userBadgeData and populate badgeId
        {
            $lookup: {
                from: "userbadges",
                localField: "_id",
                foreignField: "userId",
                as: "userBadgeData",
            },
        },
        {
            $lookup: {
                from: "badges",
                localField: "userBadgeData.badgeId",
                foreignField: "_id",
                as: "badges",
            },
        },
        // Unwind userAppData to avoid nested array (optional)
        {
            $unwind: {
                path: "$userAppData",
                preserveNullAndEmptyArrays: true, // Keeps users even if no data
            },
        },
        {
            $unwind: {
                path: "$badges",
                preserveNullAndEmptyArrays: true, // Keeps users even if no data
            },
        },
        // Group and format the final result
        {
            $project: {
                _id: 1,
                email: 1,
                role: 1,
                isVerified: 1,
                name: 1,
                dateOfBirth: 1,
                gender: 1,
                height: 1,
                weight: 1,
                primaryGoal: 1,
                diet: 1,
                restriction: 1,
                activityLevel: 1,
                occupation: 1,
                image: 1,
                mobile: 1,
                isProfileUpdated: 1,
                isDeleted: 1,
                isBlocked: 1,
                fcmToken: 1,
                movementDifficulty: 1,
                injury: 1,
                userAppData: 1,
                userMealData: "$meals",
                userBadgeData: "$badges",
            },
        },
    ]);
    // Check if the user exists
    if (result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const user = result[0];
    // Check for user status
    if (user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is Blocked");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is Deleted");
    }
    // Return the populated user with badge and app data
    return user;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserDeleted = yield user_model_1.User.findOne({ _id: userId });
    if (isUserDeleted === null || isUserDeleted === void 0 ? void 0 : isUserDeleted.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is already  deleted");
    }
    const user = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { isDeleted: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    return { message: "User deleted successfully." };
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserblocked = yield user_model_1.User.findOne({ _id: userId });
    if (isUserblocked === null || isUserblocked === void 0 ? void 0 : isUserblocked.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is already blocked");
    }
    const user = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { isBlocked: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    return { message: "User deleted successfully." };
});
const getTotalUserCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield user_model_1.User.countDocuments({
        isDeleted: false,
        isBlocked: false,
    });
    return { totalUsers };
});
exports.UserService = {
    createUser,
    deleteUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    blockUser,
    getTotalUserCount,
};
