"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUs = exports.Terms = exports.Privacy = void 0;
const mongoose_1 = require("mongoose");
const PrivacySchema = new mongoose_1.Schema({
    privacy: { type: String, required: true },
});
const TermsSchema = new mongoose_1.Schema({
    terms: { type: String, required: true },
});
const AboutUsSchema = new mongoose_1.Schema({
    about: { type: String, required: true },
});
exports.Privacy = (0, mongoose_1.model)("Privacy", PrivacySchema);
exports.Terms = (0, mongoose_1.model)("Terms", TermsSchema);
exports.AboutUs = (0, mongoose_1.model)("AboutUs", AboutUsSchema);
