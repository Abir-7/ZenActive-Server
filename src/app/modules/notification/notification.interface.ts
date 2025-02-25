import mongoose from "mongoose";

export enum NotificationType {
  LIKE = "like",
  COMMENT = "comment",
  FRIEND_REQUEST = "friend_request",
  JOIN_GROUP_REQUEST = "join_group_request",
}

export interface INotification {
  receiverId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: NotificationType;
  postId?: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
