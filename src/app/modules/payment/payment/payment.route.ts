import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.get(
  "/",

  auth("ADMIN"),
  PaymentController.getAllTransection
);

router.get(
  "/earn",

  auth("ADMIN"),
  PaymentController.getUserPaymentData
);

router.get(
  "/total-earn",

  auth("ADMIN"),
  PaymentController.getTotalEarnings
);

router.post("/webhook/revenuecat", PaymentController.webHookHandler);

router.get(
  "/my-subsription",

  auth("USER"),
  PaymentController.getMySubscription
);

export const PaymentRoute = router;
