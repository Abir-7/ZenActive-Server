"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionSchema = new mongoose_1.Schema({
    productId: { type: String, required: true },
    purchaseId: { type: String, required: true },
    expiryData: { type: String, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now },
    packageName: { type: String, required: true },
    purchaseToken: { type: String, required: true },
    packagePrice: { type: Number, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
});
const Subscription = (0, mongoose_1.model)("Subscription", SubscriptionSchema);
exports.default = Subscription;
