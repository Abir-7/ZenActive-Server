import { Types } from "mongoose";

export interface IUserWorkoutPlan {
  userId: Types.ObjectId;
  workoutPlanId: Types.ObjectId;

  currentWorkoutIndex: number;
  currentExerciseIndex: number;

  completedExercises: [
    {
      workoutIndex: Number;
      exerciseIndex: Number;
      completedAt: Date;
    }
  ];

  startedAt: Date;
  endAt: Date;
  isCompleted: IStatus;
}

export const status = ["Completed", "InProgress"] as const;

type IStatus = (typeof status)[number];
