import { model, Schema } from "mongoose";
import { IDailyChallenge } from "./usersDailyExercise.interface";

const DailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DailyChallenge = model<IDailyChallenge>(
  "DailyChallenge",
  DailyChallengeSchema
);

export default DailyChallenge;
