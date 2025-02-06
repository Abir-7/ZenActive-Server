import { Schema, model, Document } from "mongoose";
import { IDailyExercise } from "./dailyExercise.interface";

const DailyExerciseSchema = new Schema<IDailyExercise>(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const DailyExercise = model<IDailyExercise>(
  "DailyExercise",
  DailyExerciseSchema
);

export default DailyExercise;
