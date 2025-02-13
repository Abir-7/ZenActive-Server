import { Types } from "mongoose";

export interface IPost {
  [x: string]: unknown;
  text: string;

  userId: Types.ObjectId;
  groupId: Types.ObjectId | null;
  isGroup: boolean;
  isDelete: boolean;
}
