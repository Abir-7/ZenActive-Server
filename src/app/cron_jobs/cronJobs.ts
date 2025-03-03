import cron from "node-cron";
import UserMealPlan from "../modules/userMealPlan/userMealPlan.model";
import DailyExercise from "../modules/usersDailyExercise/dailyExercise.model";

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
};
