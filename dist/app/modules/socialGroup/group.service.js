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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const group_model_1 = require("./group.model");
const http_status_1 = __importDefault(require("http-status"));
const createGroup = (groupData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.create(Object.assign(Object.assign({}, groupData), { users: [userId], admin: userId }));
    return group;
});
const updateGroup = (groupId, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_model_1.Group.findOneAndUpdate({ _id: groupId, admin: userId, isDeleted: false }, updateData, { new: true })
        .populate({ path: "users", select: "name email _id image" })
        .exec();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Group update failed.");
    }
    return result;
});
const addUserToGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findOne({ _id: groupId, isDeleted: false }).exec();
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, " Group not found");
    }
    if (group.users.some((id) => id.equals(userId))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User alreadyu added.");
    }
    group.users.push(new mongoose_1.Types.ObjectId(userId));
    const updatedGroup = yield group.save();
    return updatedGroup;
});
const leaveFromGroup = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isAdmin = yield group_model_1.Group.findOne({ admin: userId });
    if (isAdmin) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are admin. can't leave group.");
    }
    const updatedGroup = yield group_model_1.Group.findOneAndUpdate({ _id: groupId, isDeleted: false }, { $pull: { user: userId } }, { new: true });
    if (!updatedGroup) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove user from group: either the group does not exist or you are not authorized as admin");
    }
    return updatedGroup;
});
const removeUserFromGroup = (groupId, userId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    if (adminId === userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are admin. can't remove from the group.");
    }
    const updatedGroup = yield group_model_1.Group.findOneAndUpdate({ _id: groupId, admin: adminId, isDeleted: false }, { $pull: { user: userId } }, { new: true });
    if (!updatedGroup) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to remove user from group: either the group does not exist or you are not authorized as admin");
    }
    return updatedGroup;
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
const getUserAllGroups = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield group_model_1.Group.find({
        isDeleted: false,
        users: { $in: [userId] },
    }).exec();
    return groups;
});
const getSingleGroupData = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.find({
        isDeleted: false,
        _id: groupId,
    });
    return group;
});
exports.GroupService = {
    createGroup,
    updateGroup,
    addUserToGroup,
    removeUserFromGroup,
    leaveFromGroup,
    deleteGroup,
    getUserAllGroups,
    getSingleGroupData,
};
