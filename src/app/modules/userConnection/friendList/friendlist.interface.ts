import { Types } from "mongoose";

export interface IUserConnection {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  isAccepted: boolean;
  status: IStatus;
  statusChangeBy: Types.ObjectId;
  lastMessage: string;
}

export const status = ["blocked", "unfriend"] as const;
type IStatus = (typeof status)[number];
