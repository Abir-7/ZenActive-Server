import QueryBuilder from "../../../builder/QueryBuilder";
import Subscription from "./subscription.model";

const createSubscription = async (
  subscriptionData: ISubscription,
  userId: string
) => {
  return await Subscription.create({ ...subscriptionData, userId });
};
const getSubscriptionData = async (timePeriod: "weekly" | "monthly") => {
  const endDate = new Date(); // Today's date
  const startDate = new Date();

  // Calculate the start date based on the time period
  if (timePeriod === "weekly") {
    startDate.setDate(endDate.getDate() - 7); // Last 7 days
  } else if (timePeriod === "monthly") {
    startDate.setMonth(endDate.getMonth() - 1); // Last 30 days (approx)
  } else {
    throw new Error('Invalid time period. Use "weekly" or "monthly".');
  }

  try {
    // Step 1: Use MongoDB Aggregation Pipeline
    const result = await Subscription.aggregate([
      // Match documents within the date range
      {
        $match: {
          purchaseDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Group by day and calculate total earnings
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" }, // Format date as YYYY-MM-DD
          },
          totalEarnings: { $sum: "$packagePrice" }, // Sum earnings for each day
        },
      },
      // Project the result into the desired format
      {
        $project: {
          _id: 0, // Exclude the default _id field
          date: "$_id", // Rename _id to date
          earnings: "$totalEarnings", // Rename totalEarnings to earnings
        },
      },
    ]).exec();

    // Step 2: Create a map of earnings by day for quick lookup
    const earningsByDay: { [key: string]: number } = {};
    result.forEach((entry) => {
      earningsByDay[entry.date] = entry.earnings;
    });

    // Step 3: Fill in missing days with 0 earnings
    const finalResult: { date: string; earnings: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD
      finalResult.push({
        date: dateString,
        earnings: earningsByDay[dateString] || 0, // Default to 0 if no earnings for the day
      });
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return finalResult;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getAllTransection = async (query: Record<string, unknown>) => {
  const allData = new QueryBuilder(
    Subscription.find().populate("userId"),
    query
  )
    .paginate()
    .sort();

  return await allData.modelQuery;
};

const getTotalEarnings = async () => {
  const result = await Subscription.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$packagePrice" },
      },
    },
  ]);

  return { totalEarn: result.length > 0 ? result[0].totalEarnings : 0 };
};

export const SubscriptionService = {
  createSubscription,
  getSubscriptionData,
  getAllTransection,
  getTotalEarnings,
};
