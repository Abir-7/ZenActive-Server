import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { SubscriptionController } from "./subscription.controller";
import validateRequest from "../../../middleware/validator";
import { zodSubscriptionSchema } from "./subscription.validation";

const router = Router();

router.post(
  "/",
  //validateRequest(zodSubscriptionSchema),
  auth("USER"),
  SubscriptionController.createSubscription
);

export const SubscriptionRoute = router;
