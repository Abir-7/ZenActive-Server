import mongoose from "mongoose";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../../errors/AppError";
import { User } from "../../user/user.model";
import { IPayment } from "./payment.interface";
import Payment from "./payment.model";

const createUserPayment = async (
  subscriptionData: IPayment,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const subscriptions = await Payment.create(
      [{ ...subscriptionData, userId }],
      { session }
    );

    await User.findByIdAndUpdate(
      userId,
      { hasPremiumAccess: true },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return subscriptions[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getUserPaymentData = async (timePeriod: "weekly" | "monthly") => {
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
    const result = await Payment.aggregate([
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
  const allData = new QueryBuilder(Payment.find().populate("userId"), query)
    .search(["packageName", "purchaseId"])
    .filter()
    .paginate()
    .sort();

  const data = await allData.modelQuery;

  const meta = await allData.countTotal();

  return { data, meta };
};

const getTotalEarnings = async () => {
  const result = await Payment.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$packagePrice" },
      },
    },
  ]);

  return { totalEarn: result.length > 0 ? result[0].totalEarnings : 0 };
};

export const PaymentService = {
  createUserPayment,
  getUserPaymentData,
  getAllTransection,
  getTotalEarnings,
};
