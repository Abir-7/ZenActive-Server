"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyTermsAboutUsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const privacy_terms_aboutus_service_1 = require("./privacy_terms_aboutus.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Create or update Privacy
const createOrUpdatePrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const privacyData = req.body;
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.createOrUpdatePrivacy(privacyData);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Privacy created/updated successfully.",
    });
}));
const getPrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.getPrivacy();
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Privacy fetched successfully.",
    });
}));
// Create or update Terms
const createOrUpdateTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termsData = req.body;
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.createOrUpdateTerms(termsData);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Terms created/updated successfully.",
    });
}));
const getTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.getTerms();
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Terms fetched successfully.",
    });
}));
// Create or update AboutUs
const createOrUpdateAboutUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aboutUsData = req.body;
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.createOrUpdateAboutUs(aboutUsData);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "AboutUs created/updated successfully.",
    });
}));
const getAboutUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_terms_aboutus_service_1.PrivacyTermsAboutUsService.getAboutUs();
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "AboutUs fetched successfully.",
    });
}));
exports.PrivacyTermsAboutUsController = {
    createOrUpdatePrivacy,
    createOrUpdateTerms,
    createOrUpdateAboutUs,
    getPrivacy,
    getTerms,
    getAboutUs,
};
