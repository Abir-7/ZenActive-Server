import { Schema, model } from "mongoose";
import { IAboutUs, IPrivacy, ITerms } from "./privacy_terms_aboutus.interface";

const PrivacySchema = new Schema<IPrivacy>({
  privacy: { type: String, required: true },
});

const TermsSchema = new Schema<ITerms>({
  terms: { type: String, required: true },
});

const AboutUsSchema = new Schema<IAboutUs>({
  about: { type: String, required: true },
});

export const Privacy = model<IPrivacy>("Privacy", PrivacySchema);
export const Terms = model<ITerms>("Terms", TermsSchema);
export const AboutUs = model<IAboutUs>("AboutUs", AboutUsSchema);
