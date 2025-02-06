import { Types } from "mongoose";

export interface ILike {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  isLiked: boolean;
}
