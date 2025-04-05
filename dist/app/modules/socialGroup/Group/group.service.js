"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const group_model_1 = require("./group.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const userGroup_model_1 = require("../UsersGroup/userGroup.model");
const post_model_1 = __importDefault(require("../../blog/post/post.model"));
const createGroup = (groupData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const group = yield group_model_1.Group.create([Object.assign(Object.assign({}, groupData), { admin: userId })], {
            session,
        });
        if (!group || !((_a = group[0]) === null || _a === void 0 ? void 0 : _a._id)) {
            throw new Error("Group creation failed");
        }
        yield userGroup_model_1.UserGroup.create([{ groupId: group[0]._id, userId: group[0].admin }], { session });
        yield session.commitTransaction();
        session.endSession();
        return group[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, "Faild to create group.");
    }
});
const updateGroup = (groupId, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(updateData, groupId, userId);
    const groupData = yield group_model_1.Group.findById(groupId).lean();
    if (groupData && groupData.admin.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "You are not admin.");
    }
    const result = yield group_model_1.Group.findOneAndUpdate({ _id: groupId, admin: userId, isDeleted: false }, updateData, { new: true }).exec();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Group update failed.");
    }
    return result;
});
const deleteGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isAdmin = yield group_model_1.Group.findOne({ _id: groupId, admin: userId });
    if (!isAdmin) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Only admin can delete group");
    }
    const deletedGroup = yield group_model_1.Group.findByIdAndUpdate(groupId, {
        isDeleted: true,
    }).exec();
    if (!deletedGroup) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete group");
    }
    return { message: "Group deleted." };
});
const getAllGroup = (userId_1, searchText_1, ...args_1) => __awaiter(void 0, [userId_1, searchText_1, ...args_1], void 0, function* (userId, searchText, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { type: "Public" };
    if (searchText) {
        const searchRegex = new RegExp(searchText, "i");
        filter.$or = [{ name: searchRegex }, { goal: searchRegex }];
    }
    // Get total count before pagination
    const total = yield group_model_1.Group.countDocuments(filter);
    const totalPage = Math.ceil(total / limit);
    const groups = yield group_model_1.Group.aggregate([
        {
            $match: filter, // Get only public groups
        },
        {
            $lookup: {
                from: "usergroups", // Join with UserGroup collection
                localField: "_id",
                foreignField: "groupId",
                as: "members",
            },
        },
        {
            $addFields: {
                totalMembers: { $size: "$members" }, // Count total members
                userJoined: {
                    $in: [new mongoose_1.default.Types.ObjectId(userId), "$members.userId"],
                }, // Check if user is a member
            },
        },
        {
            $match: { userJoined: false }, // Exclude groups where user has joined
        },
        {
            $project: {
                members: 0, // Exclude members array from response
                userJoined: 0, // Remove extra field
            },
        },
        { $skip: skip }, // Apply pagination
        { $limit: limit }, // Limit the number of results
    ]);
    return {
        meta: { limit, page, total, totalPage },
        data: groups,
    };
});
const getSingleGroupData = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupData = yield group_model_1.Group.aggregate([
        {
            $match: {
                _id: new mongoose_1.Types.ObjectId(groupId),
                isDeleted: false,
            },
        },
        {
            $lookup: {
                from: "usergroups", // Collection name of UserGroupModel (MongoDB converts 'UserGroup' -> 'usergroups')
                localField: "_id",
                foreignField: "groupId",
                as: "members",
            },
        },
        {
            $match: {
                "members.userId": new mongoose_1.Types.ObjectId(userId), // Ensure the user is a member
            },
        },
        {
            $addFields: {
                totalMembers: { $size: "$members" }, // Count total members in the group
            },
        },
        {
            $project: {
                members: 0, // Exclude detailed members array if not needed
            },
        },
    ]);
    if (!groupData.length) {
        throw new Error("Group not found or user is not a member.");
    }
    const totalPost = yield post_model_1.default.find({
        groupId,
        isDelete: false,
    }).estimatedDocumentCount();
    yield userGroup_model_1.UserGroup.findOneAndUpdate({ userId, groupId }, { previousTotalPost: totalPost, newPost: 0 });
    return groupData[0];
});
exports.GroupService = {
    createGroup,
    updateGroup,
    deleteGroup,
    getSingleGroupData,
    getAllGroup,
};
