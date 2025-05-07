import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { getAllSubscriptionPlan } from "./subscriptionController";

const router = Router();
router.get("/", auth("ADMIN", "USER"), getAllSubscriptionPlan);
export const SubscriptionPlanRoute = router;
