import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionStatus } from "./payment.interface";

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: String, required: true },
    purchaseToken: { type: String, required: true, unique: true },
    platform: { type: String, enum: ["ios", "android"], required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
    },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    originalTransactionId: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
