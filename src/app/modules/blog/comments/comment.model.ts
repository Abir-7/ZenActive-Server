import mongoose, { model, Schema } from "mongoose";
import { IComment } from "./comment.interface";

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comment: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
