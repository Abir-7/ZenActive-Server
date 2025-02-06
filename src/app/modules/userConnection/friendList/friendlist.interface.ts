import { Types } from "mongoose";

export interface IFriend {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  isAccepted: boolean;
}
