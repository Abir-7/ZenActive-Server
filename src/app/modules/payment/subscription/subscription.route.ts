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
router.get(
  "/earn",
  //validateRequest(zodSubscriptionSchema),
  auth("ADMIN"),
  SubscriptionController.getSubscriptionData
);
router.get(
  "/",
  //validateRequest(zodSubscriptionSchema),
  auth("ADMIN"),
  SubscriptionController.getAllTransection
);

router.get(
  "/total-earn",

  auth("ADMIN"),
  SubscriptionController.getTotalEarnings
);

export const SubscriptionRoute = router;
