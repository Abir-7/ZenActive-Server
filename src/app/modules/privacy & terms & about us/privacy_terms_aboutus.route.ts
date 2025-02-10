import { Router } from "express";
import { PrivacyTermsAboutUsController } from "./privacy_terms_aboutus.controller";
import auth from "../../middleware/auth/auth";

const router = Router();
router.post(
  "/privacy",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdatePrivacy
);
router.get("/privacy", PrivacyTermsAboutUsController.getPrivacy);
router.post(
  "/terms",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdateTerms
);
router.get("/terms", PrivacyTermsAboutUsController.getTerms);
router.post(
  "/about-us",
  auth("ADMIN"),
  PrivacyTermsAboutUsController.createOrUpdateAboutUs
);
router.get("/about-us", PrivacyTermsAboutUsController.getAboutUs);
export const PrivacyTermsAboutUsRoute = router;
