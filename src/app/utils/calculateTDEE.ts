import { IUpdateUser } from "../modules/user/user.interface";

export const calculateTDEE = (userData: {
  weight: number;
  height: number;
  dateOfBirth: Date;
  gender: string;
  activityLevel: string;
  primaryGoal: string;
}): number => {
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

  // Activity multiplier based on the activityLevel string
  let activityMultiplier: number;
  switch (activityLevel) {
    case "Lightly Active (light exercise 1-3 days/week)":
      activityMultiplier = 1.375;
      break;
    case "Moderately Active (exercise 3-5 days/week)":
      activityMultiplier = 1.55;
      break;
    case "Very Active (hard exercise 6-7 days/week)":
      activityMultiplier = 1.725;
      break;
    case "Super Active (intense exercise every day)":
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2; // Default to Sedentary (little to no exercise)
  }

  // Calculate TDEE
  const tdee = bmr * activityMultiplier;

  // Adjust for primary goal
  let adjustedTDEE = tdee;
  switch (primaryGoal) {
    case "Lose Weight":
      adjustedTDEE -= 500; // Subtract 500 calories for weight loss
      break;
    case "Build Muscle":
    case "Gain Weight":
      adjustedTDEE += 500; // Add 500 calories for muscle gain or weight gain
      break;
    case "Improve Endurance":
      adjustedTDEE += 200; // Add 200 calories for endurance improvement
      break;
    case "Increase Flexibility":
      adjustedTDEE += 100; // Add 100 calories for flexibility
      break;
    case "Boost Energy":
      adjustedTDEE += 150; // Add 150 calories for energy
      break;
    case "Enhance Mental health":
      adjustedTDEE += 100; // Add 100 calories for mental well-being
      break;
    default:
      // No adjustment if goal is not recognized
      break;
  }

  return adjustedTDEE;
};
