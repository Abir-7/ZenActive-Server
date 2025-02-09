import { IAboutUs, IPrivacy, ITerms } from "./privacy_terms_aboutus.interface";
import { AboutUs, Privacy, Terms } from "./privacy_terms_aboutus.model";

const createOrUpdatePrivacy = async (privacyData: IPrivacy) => {
  let privacy = await Privacy.findOne().exec();
  if (privacy) {
    privacy.privacy = privacyData.privacy;
    return await privacy.save();
  } else {
    privacy = new Privacy(privacyData);
    return await privacy.save();
  }
};

const createOrUpdateTerms = async (termsData: ITerms) => {
  let terms = await Terms.findOne().exec();
  if (terms) {
    terms.terms = termsData.terms;
    return await terms.save();
  } else {
    terms = new Terms(termsData);
    return await terms.save();
  }
};

const createOrUpdateAboutUs = async (aboutUsData: IAboutUs) => {
  let aboutUs = await AboutUs.findOne().exec();
  if (aboutUs) {
    aboutUs.about = aboutUsData.about;
    return await aboutUs.save();
  } else {
    aboutUs = new AboutUs(aboutUsData);
    return await aboutUs.save();
  }
};

export const PrivacyTermsAboutUsService = {
  createOrUpdatePrivacy,
  createOrUpdateTerms,
  createOrUpdateAboutUs,
};
