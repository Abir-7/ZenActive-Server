import cron from "node-cron";
import UserMealPlan from "../modules/userMealPlan/userMealPlan.model";
import DailyExercise from "../modules/usersDailyExercise/dailyExercise.model";
import Exercise from "../modules/workout&exercise/exercise/exercise.model";
import { Types } from "mongoose";
import DailyChallenge from "../modules/usersDailyChallage/usersDailyExercise.model";

export const setupCronJobs = () => {
  // delete user meal plan at 12Am everyday
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await UserMealPlan.deleteMany();
      console.log(`Deleted ${result.deletedCount} meal plans.`);
    } catch (error) {
      console.error("Error deleting meal plans:", error);
    }
  });
  //end

  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await DailyExercise.deleteMany();
      console.log(`Deleted ${result.deletedCount} DailyExercise.`);
    } catch (error) {
      console.error("Error deleting DailyExercise:", error);
    }
  });

  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await DailyChallenge.deleteMany();
      console.log(`Deleted ${result.deletedCount} Daily Challenges.`);

      // 1️⃣ Fetch all exercises
      const allExercises = await Exercise.find({}, "_id").lean();

      if (allExercises.length === 0) {
        console.log("No exercises found!");
        return;
      }

      // 2️⃣ Shuffle & Select 10 Random Exercise IDs
      const shuffledExercises = allExercises
        .map((exercise) => exercise._id)
        .sort(() => 0.5 - Math.random()) // Random shuffle
        .slice(0, 10); // Pick first 10

      // 3️⃣ Create Daily Challenge Entries
      const dailyChallenges = shuffledExercises.map((exerciseId) => ({
        exerciseId: new Types.ObjectId(exerciseId),
      }));

      // 4️⃣ Insert into MongoDB
      await DailyChallenge.insertMany(dailyChallenges);
      console.log("Daily Challenges Created:", dailyChallenges);
    } catch (error) {
      console.error("Error creating daily challenges:", error);
    }
  });
};

const abc = async () => {
  try {
    const result = await DailyChallenge.deleteMany();
    console.log(`Deleted ${result.deletedCount} Daily Challenges.`);

    // 1️⃣ Fetch all exercises
    const allExercises = await Exercise.find({}, "_id").lean();

    if (allExercises.length === 0) {
      console.log("No exercises found!");
      return;
    }

    // 2️⃣ Shuffle & Select 10 Random Exercise IDs
    const shuffledExercises = allExercises
      .map((exercise) => exercise._id)
      .sort(() => 0.5 - Math.random()) // Random shuffle
      .slice(0, 10); // Pick first 10

    // 3️⃣ Create Daily Challenge Entries
    const dailyChallenges = shuffledExercises.map((exerciseId) => ({
      exerciseId: new Types.ObjectId(exerciseId),
    }));

    // 4️⃣ Insert into MongoDB
    await DailyChallenge.insertMany(dailyChallenges);
    console.log("Daily Challenges Created:", dailyChallenges);
  } catch (error) {
    console.error("Error creating daily challenges:", error);
  }
};
