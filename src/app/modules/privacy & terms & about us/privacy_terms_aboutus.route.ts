import { Router } from "express";
import { PrivacyTermsAboutUsController } from "./privacy_terms_aboutus.controller";
import auth from "../../middleware/auth/auth";

const router = Router();
router.post(
  "/privacy",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdatePrivacy
); // Create or update Privacy
router.post(
  "/terms",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdateTerms
); // Create or update Terms
router.post(
  "/about-us",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdateAboutUs
); // Create or update AboutUs
export const PrivacyTermsAboutUsRoute = router;
