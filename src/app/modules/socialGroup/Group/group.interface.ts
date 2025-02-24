import { Types } from "mongoose";

export interface IGroup {
  name: string;
  type: GroupTypeArray;
  goal: string;
  admin: Types.ObjectId;

  isDeleted: boolean;
  image: string;
}

export const groupTypes = ["Public", "Private"] as const;
type GroupTypeArray = (typeof groupTypes)[number];
