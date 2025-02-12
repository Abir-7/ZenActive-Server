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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyTermsAboutUsService = void 0;
const privacy_terms_aboutus_model_1 = require("./privacy_terms_aboutus.model");
const createOrUpdatePrivacy = (privacyData) => __awaiter(void 0, void 0, void 0, function* () {
    let privacy = yield privacy_terms_aboutus_model_1.Privacy.findOne().exec();
    if (privacy) {
        privacy.privacy = privacyData.privacy;
        return yield privacy.save();
    }
    else {
        privacy = new privacy_terms_aboutus_model_1.Privacy(privacyData);
        return yield privacy.save();
    }
});
const getPrivacy = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield privacy_terms_aboutus_model_1.Privacy.findOne().exec();
});
const createOrUpdateTerms = (termsData) => __awaiter(void 0, void 0, void 0, function* () {
    let terms = yield privacy_terms_aboutus_model_1.Terms.findOne().exec();
    if (terms) {
        terms.terms = termsData.terms;
        return yield terms.save();
    }
    else {
        terms = new privacy_terms_aboutus_model_1.Terms(termsData);
        return yield terms.save();
    }
});
const getTerms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield privacy_terms_aboutus_model_1.Terms.findOne().exec();
});
const createOrUpdateAboutUs = (aboutUsData) => __awaiter(void 0, void 0, void 0, function* () {
    let aboutUs = yield privacy_terms_aboutus_model_1.AboutUs.findOne().exec();
    if (aboutUs) {
        aboutUs.about = aboutUsData.about;
        return yield aboutUs.save();
    }
    else {
        aboutUs = new privacy_terms_aboutus_model_1.AboutUs(aboutUsData);
        return yield aboutUs.save();
    }
});
const getAboutUs = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield privacy_terms_aboutus_model_1.AboutUs.findOne().exec();
});
exports.PrivacyTermsAboutUsService = {
    createOrUpdatePrivacy,
    createOrUpdateTerms,
    createOrUpdateAboutUs,
    getPrivacy,
    getTerms,
    getAboutUs,
};
