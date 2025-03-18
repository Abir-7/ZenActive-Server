import UserWorkoutPlan from "./userWorkoutPlan.model";

import AppError from "../../errors/AppError";
import { WorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.model";

import Workout from "../workout&exercise/workout/workout.model";
import { UserAppData } from "../userAppData/appdata.model";
import status from "http-status";

const startWorkoutPlan = async (userId: string, workoutPlanId: string) => {
  const workoutPlan = await WorkoutPlan.findOne({
    _id: workoutPlanId,
  }).populate({
    path: "workouts",
    populate: {
      path: "exercises",
      model: "Exercise",
    },
  });

  if (!workoutPlan) {
    throw new AppError(404, "Workout plan not found.");
  }

  const plans = {
    userId,
    workoutPlanId,
    currentWorkoutIndex: 0,
    currentExerciseIndex: 0,
    isCompleted: "InProgress",
    startedAt: Date.now(),
    endAt: new Date(Date.now() + workoutPlan.duration * 24 * 60 * 60 * 1000),
  };

  const isExist = await UserWorkoutPlan.findOne({
    workoutPlanId,
    userId: userId,
    isCompleted: "InProgress",
  });

  if (isExist) {
    throw new AppError(
      404,
      `Workout plan currently in ${isExist.isCompleted}.`
    );
  }

  const userWorkoutPlan = await UserWorkoutPlan.create(plans);
  return userWorkoutPlan;
};

// Update the present workout in a user's workout plan
const updatePresentWorkout = async (userId: string, planId: string) => {
  const progress = await UserWorkoutPlan.findOne({
    userId,
    workoutPlanId: planId,
  }).populate({ path: "workoutPlanId", populate: "workouts" });

  if (!progress) {
    throw new Error("User progress not found");
  }
  const { currentWorkoutIndex, currentExerciseIndex } = progress;

  const plan = await WorkoutPlan.findById(planId).populate({
    path: "workouts",
    populate: {
      path: "exercises",
      model: "Exercise",
    },
  }); // Fetch the workout plan

  if (!plan) {
    throw new Error("Workout plan not found");
  }

  const currentWorkout = plan.workouts[currentWorkoutIndex];

  if (!currentWorkout) {
    throw new Error("CurrentWorkout Workout not found");
  }

  const workout = await Workout.findById(currentWorkout._id);

  if (!workout) {
    throw new Error("Workout not found");
  }

  // const currentExercise = workout.exercises[currentExerciseIndex];

  progress.completedExercises.push({
    workoutIndex: currentWorkoutIndex,
    exerciseIndex: currentExerciseIndex,
    completedAt: new Date(),
  });

  const appData = await UserAppData.findOne({
    userId: userId,
  });

  if (!appData) {
    throw new AppError(status.NOT_FOUND, "Appdata  not found.");
  }

  if (progress?.completedExercises.length >= 2) {
    const lastTwo = progress?.completedExercises.slice(-2); // Get the last two elements
    const [first, second] = lastTwo;

    const firstDate = first.completedAt.toISOString().split("T")[0]; // Extract date part
    const secondDate = second.completedAt.toISOString().split("T")[0];

    if (
      firstDate === secondDate &&
      first.workoutIndex !== second.workoutIndex
    ) {
      throw new Error("You have to do these exercises tomorrow.");
    }
  }
  if (currentExerciseIndex + 1 < workout.exercises.length) {
    // If there are more exercises in the current workout
    progress.currentExerciseIndex += 1;
  } else {
    // Move to the next workout
    appData.points = (appData.points ? appData.points : 0) + workout.points;

    await appData.save();

    if (currentWorkoutIndex + 1 < plan.workouts.length) {
      progress.currentWorkoutIndex += 1;
      progress.currentExerciseIndex = 0; // Reset to the first exercise of the next workout
    } else {
      // If all workouts are completed, mark the plan as completed

      appData.points = (appData?.points ? appData.points : 0) + plan?.points;
      await appData.save();

      progress.isCompleted = "Completed";
      progress.endAt = new Date(Date.now());
    }
  }
  await progress.save();
  return progress;
};

// Increment the number of workouts done

// Get a user's active workout plan
// const getActiveWorkoutPlan = async (userId: string, planId: string) => {
//   console.log(userId, planId);
//   const data = await UserWorkoutPlan.findOne({
//     workoutPlanId: planId,
//     userId,
//     isCompleted: "InProgress",
//   })
//     .populate({
//       path: "workoutPlanId",
//       select: "title _id duration workouts",
//       populate: {
//         path: "workouts",
//         select: "_id name description exercises",
//         populate: {
//           path: "exercises",
//         },
//       },
//     })
//     .lean();

//   return data;
// };

const getActiveWorkoutPlan = async (userId: string, planId: string) => {
  const data = await UserWorkoutPlan.findOne({
    userId,
    workoutPlanId: planId,
    isCompleted: "InProgress",
  })
    .populate({ path: "workoutPlanId", populate: "workouts" })
    .lean();

  if (!data) return null;

  const { startedAt, completedExercises } = data;

  // Normalize `startedAt` to only the date part (YYYY-MM-DD)
  const startDate = new Date(startedAt);
  startDate.setHours(0, 0, 0, 0); // Remove time for accurate comparison

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

  // Ensure today is not before `startedAt`
  if (today < startDate) {
    return { ...data, missedDays: [] };
  }

  // Store completed workout days in a Set
  const completedDays = new Set<string>();

  for (const exercise of completedExercises) {
    const completedDate = new Date(exercise.completedAt);
    const completedDateStr = completedDate.toISOString().split("T")[0];

    // Store only if the exercise was completed before 8 PM
    if (completedDate.getUTCHours() < 20) {
      completedDays.add(completedDateStr);
    }
  }

  const missedDays: string[] = [];
  let currentDate = new Date(startDate);

  // Iterate from `startedAt` to `today`
  while (currentDate <= today) {
    const currentDateStr = currentDate.toISOString().split("T")[0];

    // Add to missedDays only if it's not in completedDays
    if (!completedDays.has(currentDateStr)) {
      missedDays.push(currentDateStr);
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  return {
    ...data,
    missedDays, // List of missed workout dates
  };
};

// const giveFeedback = async (data: {
//   planId: string;
//   dificulty: string;
//   isAllExcerciseComplete: boolean;
//   challengesFace: string;
// }) => {
// const result=await User

// };

export const UserWorkoutPlanService = {
  startWorkoutPlan,
  updatePresentWorkout,

  getActiveWorkoutPlan,
};
