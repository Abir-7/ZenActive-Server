import { Types } from "mongoose";

export interface IWorkoutPlan {
  name: string;
  description?: string;
  duration: number;
  workouts: [Types.ObjectId];
  rewardPoints: number;
  isDeleted: boolean;
  image: string;
}
