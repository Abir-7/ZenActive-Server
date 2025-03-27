import { model, Schema } from "mongoose";
import { IExercise } from "./exercise.interface";

const exerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    restTime: { type: Number, required: true },
    video: { type: String, required: true },
    videoId: { type: String, required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    goal: { type: String, required: true },
    duration: { type: Number, required: true },
    about: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Exercise = model<IExercise>("Exercise", exerciseSchema);

export default Exercise;
