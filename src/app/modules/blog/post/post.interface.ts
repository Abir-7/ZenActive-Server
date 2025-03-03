import { Types } from "mongoose";

export interface IPost {
  [x: string]: unknown;
  text: string;

  userId: Types.ObjectId;
  groupId: Types.ObjectId | null;
  image: string | null;
  isGroup: boolean;
  isDelete: boolean;
}
