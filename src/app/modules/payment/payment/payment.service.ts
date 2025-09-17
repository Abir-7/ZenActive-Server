import mongoose from "mongoose";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../../errors/AppError";
import { User } from "../../user/user.model";
import { SubscriptionStatus } from "./payment.interface";
import { Subscription } from "./payment.model";

export const getUserPaymentData = async (timePeriod: "weekly" | "monthly") => {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (timePeriod === "weekly") {
    // Monday as start of week
    const day = today.getDay(); // 0 = Sunday, 1 = Monday
    const diff = day === 0 ? 6 : day - 1; // shift so Monday = start
    startDate = new Date(today);
    startDate.setDate(today.getDate() - diff);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // full week (Mon-Sun)
    endDate.setHours(23, 59, 59, 999);
  } else if (timePeriod === "monthly") {
    // Full current month
    startDate = new Date(today.getFullYear(), today.getMonth(), 1); // 1st day
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of month
    endDate.setHours(23, 59, 59, 999);
  } else {
    throw new Error('Invalid time period. Use "weekly" or "monthly".');
  }

  try {
    // Aggregate subscription payments by day
    const result = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Dhaka",
            },
          },
          totalEarnings: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          earnings: "$totalEarnings",
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Map results for lookup
    const earningsByDay: Record<string, number> = {};
    result.forEach((entry) => {
      earningsByDay[entry.date] = entry.earnings;
    });

    // Build final array for all days
    const finalResult: { date: string; earnings: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
      finalResult.push({
        date: dateString,
        earnings: earningsByDay[dateString] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return finalResult;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};
const getAllTransection = async (query: Record<string, unknown>) => {
  const allData = new QueryBuilder(
    Subscription.find().populate("userId"),
    query
  )
    .filter()
    .paginate()
    .sort();

  const data = await allData.modelQuery;

  const meta = await allData.countTotal();

  return { data, meta };
};

export const getTotalEarnings = async () => {
  const result = await Subscription.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$price" },
      },
    },
  ]);

  const totalEarn = result?.[0]?.totalEarnings ?? 0;

  return { totalEarn };
};

export const webHookHandler = async (event: any) => {
  if (!event) throw new Error("No event found.");

  const {
    type,
    app_user_id,
    product_id,
    expiration_at_ms,
    original_transaction_id,
    purchased_at_ms,
    store,
    price,
    currency,
  } = event;

  if (!app_user_id || !original_transaction_id) {
    throw new Error("Missing required fields in event.");
  }

  const expiryDate = expiration_at_ms
    ? new Date(Number(expiration_at_ms))
    : null;
  const startDate = purchased_at_ms
    ? new Date(Number(purchased_at_ms))
    : new Date();

  // Map RevenueCat store to your platform enum
  const platform =
    store === "APP_STORE"
      ? "ios"
      : store === "PLAY_STORE"
      ? "android"
      : "unknown";

  try {
    switch (type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UPGRADE":
      case "DOWNGRADE":
        await Subscription.findOneAndUpdate(
          { purchaseToken: original_transaction_id, userId: app_user_id },
          {
            productId: product_id || "unknown",
            purchaseToken: original_transaction_id,
            platform,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            expiryDate,
            originalTransactionId: original_transaction_id,
            price: price || 0,
            currency: currency || "USD",
          },
          { upsert: true, new: true }
        );

        await User.findOneAndUpdate(
          { _id: app_user_id },
          { hasPremiumAccess: true }
        );
        break;

      case "CANCELLATION":
      case "EXPIRED":
      case "BILLING_ISSUE":
        await Subscription.findOneAndUpdate(
          { purchaseToken: original_transaction_id },
          { status: SubscriptionStatus.CANCELLED, expiryDate }
        );

        await User.findOneAndUpdate(
          { _id: app_user_id },
          { hasPremiumAccess: false }
        );
        break;

      default:
        console.log("Unhandled RevenueCat event type:", type);
    }

    return { message: "success" };
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    throw new Error("Webhook processing failed.");
  }
};

const getUserSubscription = async (userId: string) => {
  const data = await Subscription.findOne({ userId });
  return data;
};
export const PaymentService = {
  getUserSubscription,
  getUserPaymentData,
  getAllTransection,
  getTotalEarnings,
  webHookHandler,
};
