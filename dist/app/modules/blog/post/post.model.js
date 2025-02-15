"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Group", default: null },
    isGroup: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    // id: false,
});
// postSchema.virtual("commentDetails", {
//   ref: "Comment",
//   localField: "comments",
//   foreignField: "_id",
// });
// postSchema.virtual("likeDetails", {
//   ref: "Like",
//   localField: "likes",
//   foreignField: "_id",
// });
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
