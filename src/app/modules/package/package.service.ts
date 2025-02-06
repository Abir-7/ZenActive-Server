import AppError from "../../errors/AppError";

import { IPackage, TInterval } from "./package.interface";
import httpStatus from "http-status";
import { Package } from "./package.model";
import { mapInterval } from "./package.const";
import { stripe } from "../../utils/stripe/stripe";

const createPackage = async (payload: Partial<IPackage>) => {
  if (
    !payload.name ||
    !payload.features ||
    !payload.unitAmount ||
    !payload.interval
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid package data");
  }
  const isPlanExist = await Package.findOne({ name: payload.name });

  if (isPlanExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Package already exist");
  }

  const descriptionString = Array.isArray(payload.features)
    ? payload.features.join(" ") // Join elements with a space
    : payload.features;

  // Create Stripe product
  const product = await stripe.products.create({
    name: payload.name,
    description: descriptionString,
  });

  // Handle recurring intervals, including custom 'half-year'
  const recurring: {
    interval: any;
    interval_count?: number; // Optional for custom intervals
  } = {
    interval: payload.interval === "half-year" ? "month" : payload.interval,
  };

  if (payload.interval === "half-year") {
    recurring.interval_count = 6; // Custom interval count for half-year
  }
  // Create Stripe price
  const price = await stripe.prices.create({
    unit_amount: payload.unitAmount * 100,
    currency: "usd",
    recurring, // Pass the constructed recurring object
    product: product.id,
  });

  if (price) {
    const plan = await Package.create({
      name: payload.name,
      description: payload.features,
      unitAmount: payload.unitAmount,
      interval: payload.interval,
      productId: product.id,
      priceId: price.id,
      price: payload.unitAmount,
    });
    return plan;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create Package");
  }
};

const getAllPackage = async () => {
  const plans = await Package.find();

  if (!plans) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to get Package");
  }

  return plans;
};

const updatePackage = async (planId: string, updates: Partial<IPackage>) => {
  const plan = await Package.findById(planId);
  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found");
  }

  // Ensure description is always a string for Stripe
  const updatedDescription = Array.isArray(updates.features)
    ? updates.features.join(" ") // Join array elements if description is an array
    : updates.features; // Use as-is if it's already a string

  if (updates.name || updatedDescription) {
    await stripe.products.update(plan.productId, {
      name: updates.name || plan.name,
      description: updatedDescription,
    });
  }

  if (updates.unitAmount || updates.interval) {
    const stripeInterval = mapInterval(updates.interval || plan.interval);

    const newPrice = await stripe.prices.create({
      unit_amount: updates.unitAmount
        ? updates.unitAmount * 100
        : plan.unitAmount * 100,
      currency: "usd",
      recurring: { interval: stripeInterval },
      product: plan.productId,
    });

    updates.priceId = newPrice.id;
  }

  // Update the plan in the database
  const updatedPlan = await Package.findByIdAndUpdate(planId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedPlan) {
    throw new Error("Failed to update Package");
  }

  return updatedPlan.toObject();
};

const getPackageById = async (id: string) => {
  const plan = await Package.findById(id);
  if (!plan) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to get Package");
  }
  return plan;
};

const deletePackage = async (planId: string) => {
  // Step 1: Find the plan in the database
  const plan = await Package.findById(planId);
  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Plan not found");
  }

  if (!plan.productId || !plan.priceId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid plan data");
  }

  try {
    // Deactivate the product and price in Stripe
    await stripe.products.update(plan.productId, { active: false });
    await stripe.prices.update(plan.priceId, { active: false });
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to deactivate Stripe data"
    );
  }

  // Delete the plan from the database
  await Package.findByIdAndDelete(planId);

  return { message: "Plan deleted successfully" };
};

export const PackageService = {
  createPackage,
  getAllPackage,
  updatePackage,
  getPackageById,
  deletePackage,
};
