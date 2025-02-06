import { Types } from "mongoose";

export interface IBlock {
  blockedUser: Types.ObjectId[];
  userId: Types.ObjectId;
}
