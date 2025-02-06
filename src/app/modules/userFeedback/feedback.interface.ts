import { Types } from "mongoose";

export interface IUserWorkoutPlanFeedback {
  planId: Types.ObjectId;
  isAllExcerciseComplete: boolean;
  challengesFace: string;
}
