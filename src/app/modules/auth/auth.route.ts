import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validator";
import {
  zodForgotPassSchema,
  zodLoginSchema,
  zodResendCodeSchema,
  zodResetPassSchema,
  zodUpdatePasswordSchema,
} from "./auth.validation";
import { zodVerifyEmailSchema } from "../user/user.validation";
import auth from "../../middleware/auth/auth";

const router = Router();

router.post(
  "/login",
  validateRequest(zodLoginSchema),
  AuthController.loginUser
);
router.patch(
  "/verify-user",
  validateRequest(zodVerifyEmailSchema),
  AuthController.verifyUser
);
router.post(
  "/forgot-pass",
  validateRequest(zodForgotPassSchema),
  AuthController.forgotPass
);
router.post(
  "/reset-pass",
  validateRequest(zodResetPassSchema),
  AuthController.resetPassword
);

router.post(
  "/resend-code",
  validateRequest(zodResendCodeSchema),
  AuthController.reSendOtp
);

router.patch(
  "/update-password",
  auth("ADMIN", "USER"),
  validateRequest(zodUpdatePasswordSchema),
  AuthController.updatePassword
);

router.get("/get-access-token/:email", AuthController.getNewAccessToken);

export const AuthRoute = router;
