// models/workout.model.ts
import { Schema, model, Document } from "mongoose";
import { IWorkoutPlan } from "./workoutPlan.interface";

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    workouts: [{ type: Schema.Types.ObjectId, required: true, ref: "Workout" }],
    points: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, required: true },
    about: { type: String, required: true },
  },
  { timestamps: true }
);

export const WorkoutPlan = model<IWorkoutPlan>(
  "WorkoutPlan",
  WorkoutPlanSchema
);
