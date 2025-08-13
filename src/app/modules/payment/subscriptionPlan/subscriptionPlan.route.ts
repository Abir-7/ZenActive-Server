import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { getAllSubscriptionPlan } from "./subscriptionPlan.controller";

const router = Router();
router.get("/", auth("ADMIN", "USER"), getAllSubscriptionPlan);
export const SubscriptionPlanRoute = router;
