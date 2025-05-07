import { ISubscriptionPlan } from "../modules/payment/subscription/subscription.interface";
import SubscriptionPlan from "../modules/payment/subscription/subscription.model";

const subscriptionPlans: ISubscriptionPlan[] = [
  {
    id: "free-trial",
    name: "1 Month Free Trial",
    price: 0,
    features: [
      "Personalized meal plans",
      "Premium challenges/exercise",
      "Offline access",
    ],
  },
  {
    id: "monthly-subscription",
    name: "Monthly Subscription",
    price: 24,
    features: [
      "Personalized meal plans",
      "Premium challenges/exercise",
      "Offline access",
      "Group Create/Join",
    ],
  },
  {
    id: "yearly-subscription",
    name: "Yearly Subscription",
    price: 240,
    features: [
      "All Features of Monthly Subscription",
      "Save extra 4$ per month",
    ],
  },
];

export async function seedSubscription() {
  try {
    for (const plan of subscriptionPlans) {
      const existingPlan = await SubscriptionPlan.findOne({ id: plan.id });

      if (!existingPlan) {
        const newPlan = new SubscriptionPlan(plan);
        await newPlan.save();
        console.log(`Created subscription plan: ${plan.name}`);
      } else {
        console.log(`Subscription plan ${plan.name} already exists`);
      }
    }
  } catch (err) {
    console.error("Error checking or creating subscription plans:", err);
  }
}
