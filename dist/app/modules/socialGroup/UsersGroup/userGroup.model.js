"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroup = void 0;
const mongoose_1 = require("mongoose");
const UserGroupSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Group", required: true },
    previousTotalPost: { type: Number, default: 0 },
    newPost: { type: Number, default: 0 },
}, { timestamps: true });
// Export the model
exports.UserGroup = (0, mongoose_1.model)("UserGroup", UserGroupSchema);
