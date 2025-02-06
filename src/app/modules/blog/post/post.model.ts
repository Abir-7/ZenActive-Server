import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema: Schema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    isGroup: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    // id: false,
  }
);

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
const Post = model<IPost>("Post", postSchema);

export default Post;
