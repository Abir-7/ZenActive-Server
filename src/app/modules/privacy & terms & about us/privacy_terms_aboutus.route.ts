import { Router } from "express";
import { PrivacyTermsAboutUsController } from "./privacy_terms_aboutus.controller";
import auth from "../../middleware/auth/auth";
import validateRequest from "../../middleware/validator";
import {
  zodAboutUsSchema,
  zodPrivacySchema,
  zodTermsSchema,
} from "./privacy_terms_aboutus.validation";

const router = Router();
router.post(
  "/privacy",
  auth("ADMIN"),
  validateRequest(zodPrivacySchema),
  PrivacyTermsAboutUsController.createOrUpdatePrivacy
);
router.get("/privacy", PrivacyTermsAboutUsController.getPrivacy);
router.post(
  "/terms",
  auth("ADMIN"),
  validateRequest(zodTermsSchema),
  PrivacyTermsAboutUsController.createOrUpdateTerms
);
router.get("/terms", PrivacyTermsAboutUsController.getTerms);
router.post(
  "/about-us",
  auth("ADMIN"),
  validateRequest(zodAboutUsSchema),
  PrivacyTermsAboutUsController.createOrUpdateAboutUs
);
router.get("/about-us", PrivacyTermsAboutUsController.getAboutUs);
export const PrivacyTermsAboutUsRoute = router;
