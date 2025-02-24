import { Types } from "mongoose";

export interface IChat {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  seenBy: Types.ObjectId[];
}
