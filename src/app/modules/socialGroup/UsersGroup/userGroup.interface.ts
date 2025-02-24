import { Types } from "mongoose";

export interface IUserGroup {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  newPost: number;
  previousTotalPost: number;
}
