"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodSubscriptionSchema = void 0;
const zod_1 = require("zod");
exports.zodSubscriptionSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    purchaseId: zod_1.z.string().min(1, "Purchase ID is required"),
    expiryData: zod_1.z.string().min(1, "Expiry date is required"), // You can add regex if there's a specific format
    purchaseDate: zod_1.z
        .date()
        .or(zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format")),
    packageName: zod_1.z.string().min(1, "Package name is required"),
    purchaseToken: zod_1.z.string().min(1, "Purchase token is required"),
    userId: zod_1.z.string().min(1, "User ID is required"), // Assuming you need userId
});
