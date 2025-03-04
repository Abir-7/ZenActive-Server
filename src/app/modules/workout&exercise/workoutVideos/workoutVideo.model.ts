import { model, Schema } from "mongoose";
import { IWorkoutVideo } from "./workoutVideo.interface";

const WorkoutVideoSchema = new Schema<IWorkoutVideo>(
  {
    videoId: { type: String, required: true },
    video: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export const WorkoutVideo = model<IWorkoutVideo>(
  "WorkoutVideo",
  WorkoutVideoSchema
);
