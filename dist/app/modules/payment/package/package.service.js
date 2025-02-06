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
exports.PackageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const package_model_1 = require("./package.model");
const package_const_1 = require("./package.const");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const stripe_1 = require("../../../utils/stripe/stripe");
const createPackage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.name ||
        !payload.features ||
        !payload.unitAmount ||
        !payload.interval) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid package data");
    }
    const isPlanExist = yield package_model_1.Package.findOne({ name: payload.name });
    if (isPlanExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Package already exist");
    }
    const descriptionString = Array.isArray(payload.features)
        ? payload.features.join(" ") // Join elements with a space
        : payload.features;
    // Create Stripe product
    const product = yield stripe_1.stripe.products.create({
        name: payload.name,
        description: descriptionString,
    });
    // Handle recurring intervals, including custom 'half-year'
    const recurring = {
        interval: payload.interval === "half-year" ? "month" : payload.interval,
    };
    if (payload.interval === "half-year") {
        recurring.interval_count = 6; // Custom interval count for half-year
    }
    // Create Stripe price
    const price = yield stripe_1.stripe.prices.create({
        unit_amount: payload.unitAmount * 100,
        currency: "usd",
        recurring, // Pass the constructed recurring object
        product: product.id,
    });
    if (price) {
        const plan = yield package_model_1.Package.create({
            name: payload.name,
            description: payload.features,
            unitAmount: payload.unitAmount,
            interval: payload.interval,
            productId: product.id,
            priceId: price.id,
            price: payload.unitAmount,
        });
        return plan;
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create Package");
    }
});
const getAllPackage = () => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield package_model_1.Package.find();
    if (!plans) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to get Package");
    }
    return plans;
});
const updatePackage = (planId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield package_model_1.Package.findById(planId);
    if (!plan) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
    }
    // Ensure description is always a string for Stripe
    const updatedDescription = Array.isArray(updates.features)
        ? updates.features.join(" ") // Join array elements if description is an array
        : updates.features; // Use as-is if it's already a string
    if (updates.name || updatedDescription) {
        yield stripe_1.stripe.products.update(plan.productId, {
            name: updates.name || plan.name,
            description: updatedDescription,
        });
    }
    if (updates.unitAmount || updates.interval) {
        const stripeInterval = (0, package_const_1.mapInterval)(updates.interval || plan.interval);
        const newPrice = yield stripe_1.stripe.prices.create({
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
    const updatedPlan = yield package_model_1.Package.findByIdAndUpdate(planId, updates, {
        new: true,
        runValidators: true,
    });
    if (!updatedPlan) {
        throw new Error("Failed to update Package");
    }
    return updatedPlan.toObject();
});
const getPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield package_model_1.Package.findById(id);
    if (!plan) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to get Package");
    }
    return plan;
});
const deletePackage = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find the plan in the database
    const plan = yield package_model_1.Package.findById(planId);
    if (!plan) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Plan not found");
    }
    if (!plan.productId || !plan.priceId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid plan data");
    }
    try {
        // Deactivate the product and price in Stripe
        yield stripe_1.stripe.products.update(plan.productId, { active: false });
        yield stripe_1.stripe.prices.update(plan.priceId, { active: false });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to deactivate Stripe data");
    }
    // Delete the plan from the database
    yield package_model_1.Package.findByIdAndDelete(planId);
    return { message: "Plan deleted successfully" };
});
exports.PackageService = {
    createPackage,
    getAllPackage,
    updatePackage,
    getPackageById,
    deletePackage,
};
