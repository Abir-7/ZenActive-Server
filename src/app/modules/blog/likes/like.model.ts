import { model, Schema } from "mongoose";
import { ILike } from "./like.interface";

const likeSchema = new Schema<ILike>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Like = model<ILike>("Like", likeSchema);
export default Like;
