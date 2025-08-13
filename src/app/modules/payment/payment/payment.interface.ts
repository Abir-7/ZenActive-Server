import { Schema } from "mongoose";

export interface ISubscription {
  userId: Schema.Types.ObjectId;
  productId: string; // RevenueCat: event.product_id
  purchaseToken: string; // RevenueCat: event.original_transaction_id
  platform: "ios" | "android"; // RevenueCat: event.store === "APP_STORE" ? "ios" : "android"
  status: SubscriptionStatus;
  startDate: Date; // RevenueCat: event.purchased_at_ms
  expiryDate: Date; // RevenueCat: event.expiration_at_ms
  originalTransactionId: string; // RevenueCat: event.original_transaction_id

  // Directly available from RevenueCat
  price: number; // RevenueCat: event.price
  currency: string; // RevenueCat: event.currency
}
export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial",
}
