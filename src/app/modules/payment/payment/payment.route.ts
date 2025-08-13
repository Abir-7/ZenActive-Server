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
  "/total-earn",

  auth("ADMIN"),
  PaymentController.getTotalEarnings
);

router.post("/webhook/revenuecat", PaymentController.webHookHandler);

router.post(
  "/my-subsription",

  auth("USER"),
  PaymentController.getMySubscription
);

export const PaymentRoute = router;
