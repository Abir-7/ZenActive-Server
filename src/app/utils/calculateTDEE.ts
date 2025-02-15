export const calculateTDEE = (userData: {
  weight: number;
  height: number;
  dateOfBirth: Date;
  gender: string;
  activityLevel: string;
  primaryGoal: string;
}): { tdee: number; dailyWorkoutTime: number } => {
  const { weight, height, dateOfBirth, gender, activityLevel, primaryGoal } =
    userData;

  // Calculate age
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

  // Calculate BMR using the Mifflin-St Jeor equation
  let bmr: number;
  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier and baseline workout time
  let activityMultiplier: number;
  let baseWorkoutTime: number; // In minutes

  switch (activityLevel) {
    case "Lightly Active (light exercise 1-3 days/week)":
      activityMultiplier = 1.375;
      baseWorkoutTime = 30; // ~30 min/day
      break;
    case "Moderately Active (exercise 3-5 days/week)":
      activityMultiplier = 1.55;
      baseWorkoutTime = 45; // ~45 min/day
      break;
    case "Very Active (hard exercise 6-7 days/week)":
      activityMultiplier = 1.725;
      baseWorkoutTime = 60; // ~60 min/day
      break;
    case "Super Active (intense exercise every day)":
      activityMultiplier = 1.9;
      baseWorkoutTime = 75; // ~75 min/day
      break;
    default:
      activityMultiplier = 1.2; // Sedentary (little to no exercise)
      baseWorkoutTime = 15; // ~15 min/day (light movement)
  }

  // Calculate TDEE
  let tdee = bmr * activityMultiplier;

  // Adjust TDEE and workout time based on primary goal
  let adjustedTDEE = tdee;
  let workoutTimeAdjustment = 0; // Additional workout time

  switch (primaryGoal) {
    case "Lose Weight":
      adjustedTDEE -= 500; // Reduce calories
      workoutTimeAdjustment = 15; // Increase workout time
      break;
    case "Build Muscle":
    case "Gain Weight":
      adjustedTDEE += 500; // Increase calories
      workoutTimeAdjustment = 20; // More strength training
      break;
    case "Improve Endurance":
      adjustedTDEE += 200;
      workoutTimeAdjustment = 25; // Focus on cardio
      break;
    case "Increase Flexibility":
      adjustedTDEE += 100;
      workoutTimeAdjustment = 10; // Extra stretching/yoga
      break;
    case "Boost Energy":
      adjustedTDEE += 150;
      workoutTimeAdjustment = 10;
      break;
    case "Enhance Mental Health":
      adjustedTDEE += 100;
      workoutTimeAdjustment = 15; // Yoga/meditation sessions
      break;
    default:
      // No specific adjustment
      break;
  }

  const dailyWorkoutTime = (baseWorkoutTime + workoutTimeAdjustment) * 60;

  return { tdee: Math.round(adjustedTDEE), dailyWorkoutTime };
};
