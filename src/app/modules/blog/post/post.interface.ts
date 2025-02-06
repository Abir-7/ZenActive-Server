import { Types } from "mongoose";

export interface IPost {
  [x: string]: unknown;
  text: string;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  userId: Types.ObjectId;
  groupId: Types.ObjectId | null;
  isGroup: boolean;
  isDelete: boolean;
}
