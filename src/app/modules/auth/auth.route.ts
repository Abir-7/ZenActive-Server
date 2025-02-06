import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validator";
import {
  zodForgotPassSchema,
  zodLoginSchema,
  zodResetPassSchema,
} from "./auth.validation";
import { zodVerifyEmailSchema } from "../user/user.validation";

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

export const AuthRoute = router;
