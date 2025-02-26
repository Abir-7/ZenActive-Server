import { Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  comment: string;
  userId: Types.ObjectId;
}

export interface IVideoComment {
  videoId: Types.ObjectId;
  comment: string;
  userId: Types.ObjectId;
}
