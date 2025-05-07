import mongoose, { Schema } from "mongoose";
import { ISubscriptionPlan } from "./subscription.interface";

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  id: { type: String, required: false }, // Optional field, since it’s not mandatory
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], required: true }, // Array of strings for features
});

// Create and export the model
const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;
