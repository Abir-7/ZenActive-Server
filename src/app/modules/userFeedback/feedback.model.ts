import { model, Schema } from "mongoose";
import { IUserWorkoutPlanFeedback } from "./feedback.interface";

const UserWorkoutPlanFeedbackSchema = new Schema<IUserWorkoutPlanFeedback>(
  {
    planId: { type: Schema.Types.ObjectId, required: true },
    isAllExcerciseComplete: { type: Boolean, required: true },
    challengesFace: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserWorkoutPlanFeedback = model<IUserWorkoutPlanFeedback>(
  "UserWorkoutPlanFeedback",
  UserWorkoutPlanFeedbackSchema
);

export default UserWorkoutPlanFeedback;
