import mongoose, { Schema } from "mongoose";
import { IComment, IVideoComment } from "./comment.interface";

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comment: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);

//   -------------------------------------------------------------------------

const VideoCommentSchema = new Schema<IVideoComment>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutVideo",
      required: true,
    },
    comment: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
export const VideoComment = mongoose.model<IVideoComment>(
  "VideoComment",
  VideoCommentSchema
);
