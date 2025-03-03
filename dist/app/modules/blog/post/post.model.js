"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Group", default: null },
    isGroup: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    image: { type: String, default: null },
}, {
    timestamps: true,
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
