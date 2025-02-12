"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const subscription_controller_1 = require("./subscription.controller");
const router = (0, express_1.Router)();
router.post("/", 
//validateRequest(zodSubscriptionSchema),
(0, auth_1.default)("USER"), subscription_controller_1.SubscriptionController.createSubscription);
router.get("/earn", 
//validateRequest(zodSubscriptionSchema),
(0, auth_1.default)("ADMIN"), subscription_controller_1.SubscriptionController.getSubscriptionData);
router.get("/", 
//validateRequest(zodSubscriptionSchema),
(0, auth_1.default)("ADMIN"), subscription_controller_1.SubscriptionController.getAllTransection);
router.get("/total-earn", (0, auth_1.default)("ADMIN"), subscription_controller_1.SubscriptionController.getTotalEarnings);
exports.SubscriptionRoute = router;
