import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema: Schema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    isGroup: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
