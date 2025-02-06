import { Schema, model, Types } from "mongoose";
import { IUserWorkoutPlan, status } from "./userWorkoutPlan.interface";

const userWorkoutPlanSchema = new Schema<IUserWorkoutPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // Assuming there is a User model to refer to
    },
    workoutPlanId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "WorkoutPlan", // Assuming there is a WorkoutPlan model to refer to
    },
    currentWorkoutIndex: {
      type: Number,
      required: true,
    },
    currentExerciseIndex: {
      type: Number,
      required: true,
    },

    completedExercises: [
      {
        workoutIndex: {
          type: Number,
          required: true,
        },
        exerciseIndex: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    startedAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: String,
      enum: status,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const UserWorkoutPlan = model<IUserWorkoutPlan>(
  "UserWorkoutPlan",
  userWorkoutPlanSchema
);

export default UserWorkoutPlan;
