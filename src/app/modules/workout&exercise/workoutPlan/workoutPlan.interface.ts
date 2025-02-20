import { Types } from "mongoose";

export interface IWorkoutPlan {
  name: string;
  description?: string;
  duration: number;
  workouts: [Types.ObjectId];
  points: number;
  isDeleted: boolean;
  image: string;
  about: string;
}
