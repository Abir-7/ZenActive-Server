"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const subscription_model_1 = __importDefault(require("./subscription.model"));
const createSubscription = (subscriptionData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscription_model_1.default.create(Object.assign(Object.assign({}, subscriptionData), { userId }));
});
const getSubscriptionData = (timePeriod) => __awaiter(void 0, void 0, void 0, function* () {
    const endDate = new Date(); // Today's date
    const startDate = new Date();
    // Calculate the start date based on the time period
    if (timePeriod === "weekly") {
        startDate.setDate(endDate.getDate() - 7); // Last 7 days
    }
    else if (timePeriod === "monthly") {
        startDate.setMonth(endDate.getMonth() - 1); // Last 30 days (approx)
    }
    else {
        throw new Error('Invalid time period. Use "weekly" or "monthly".');
    }
    try {
        // Step 1: Use MongoDB Aggregation Pipeline
        const result = yield subscription_model_1.default.aggregate([
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
        const earningsByDay = {};
        result.forEach((entry) => {
            earningsByDay[entry.date] = entry.earnings;
        });
        // Step 3: Fill in missing days with 0 earnings
        const finalResult = [];
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
    }
    catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
});
const getAllTransection = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allData = new QueryBuilder_1.default(subscription_model_1.default.find().populate("userId"), query)
        .search(["packageName", "purchaseId"])
        .filter()
        .paginate()
        .sort();
    const data = yield allData.modelQuery;
    const meta = yield allData.countTotal();
    return { data, meta };
});
const getTotalEarnings = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$packagePrice" },
            },
        },
    ]);
    return { totalEarn: result.length > 0 ? result[0].totalEarnings : 0 };
});
exports.SubscriptionService = {
    createSubscription,
    getSubscriptionData,
    getAllTransection,
    getTotalEarnings,
};
