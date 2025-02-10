import { model, Schema } from "mongoose";
import IWorkout from "./workout.interface";

const workoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    exercises: [
      { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Workout = model<IWorkout>("Workout", workoutSchema);

export default Workout;
