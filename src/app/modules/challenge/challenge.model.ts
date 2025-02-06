import { model, Schema } from "mongoose";
import { IChallenge } from "./challenge.interface";

const ChallengeSchema: Schema = new Schema<IChallenge>({
  challengeName: { type: String, required: true },
  duration: { type: String, required: true },
  rewardPoints: { type: Number, required: true },
  goal: { type: String, required: true },
  image: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export const Challenge = model<IChallenge>("Challenge", ChallengeSchema);
