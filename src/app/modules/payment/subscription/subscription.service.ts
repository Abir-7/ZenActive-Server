import Subscription from "./subscription.model";

const createSubscription = async (
  subscriptionData: ISubscription,
  userId: string
) => {
  return await Subscription.create({ ...subscriptionData, userId });
};

export const SubscriptionService = {
  createSubscription,
};
