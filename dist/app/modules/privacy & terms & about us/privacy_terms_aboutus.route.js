"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyTermsAboutUsRoute = void 0;
const express_1 = require("express");
const privacy_terms_aboutus_controller_1 = require("./privacy_terms_aboutus.controller");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../middleware/validator"));
const privacy_terms_aboutus_validation_1 = require("./privacy_terms_aboutus.validation");
const router = (0, express_1.Router)();
router.post("/privacy", (0, auth_1.default)("ADMIN"), (0, validator_1.default)(privacy_terms_aboutus_validation_1.zodPrivacySchema), privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.createOrUpdatePrivacy);
router.get("/privacy", privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.getPrivacy);
router.post("/terms", (0, auth_1.default)("ADMIN"), (0, validator_1.default)(privacy_terms_aboutus_validation_1.zodTermsSchema), privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.createOrUpdateTerms);
router.get("/terms", privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.getTerms);
router.post("/about-us", (0, auth_1.default)("ADMIN"), (0, validator_1.default)(privacy_terms_aboutus_validation_1.zodAboutUsSchema), privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.createOrUpdateAboutUs);
router.get("/about-us", privacy_terms_aboutus_controller_1.PrivacyTermsAboutUsController.getAboutUs);
exports.PrivacyTermsAboutUsRoute = router;
