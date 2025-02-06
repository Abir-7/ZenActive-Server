import { Types } from "mongoose";

export interface IDailyExercise {
  exerciseId: Types.ObjectId;
  userId: Types.ObjectId;
  completedDate: Date;
}
