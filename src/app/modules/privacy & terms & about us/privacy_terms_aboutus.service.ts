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

const getPrivacy = async (): Promise<IPrivacy | null> => {
  return await Privacy.findOne().exec();
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

const getTerms = async (): Promise<ITerms | null> => {
  return await Terms.findOne().exec();
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

const getAboutUs = async (): Promise<IAboutUs | null> => {
  return await AboutUs.findOne().exec();
};

export const PrivacyTermsAboutUsService = {
  createOrUpdatePrivacy,
  createOrUpdateTerms,
  createOrUpdateAboutUs,
  getPrivacy,
  getTerms,
  getAboutUs,
};
