import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/",
  //validateRequest(zodSubscriptionSchema),
  auth("USER"),
  PaymentController.createUserPayment
);
router.get(
  "/earn",
  //validateRequest(zodSubscriptionSchema),
  auth("ADMIN"),
  PaymentController.createUserPayment
);
router.get(
  "/",
  //validateRequest(zodSubscriptionSchema),
  auth("ADMIN"),
  PaymentController.getAllTransection
);

router.get(
  "/total-earn",

  auth("ADMIN"),
  PaymentController.getTotalEarnings
);

export const PaymentRoute = router;
