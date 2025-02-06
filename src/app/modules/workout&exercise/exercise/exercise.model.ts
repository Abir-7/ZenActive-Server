import { model, Schema } from "mongoose";
import { IExercise } from "./exercise.interface";

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, unique: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  restTime: { type: Number, required: true },
  video: { type: String, required: true },
  points: { type: Number, required: true },

  description: { type: String, required: true },
  image: { type: String, required: true },
});
const Exercise = model<IExercise>("Exercise", exerciseSchema);

export default Exercise;
