import { Request, Response } from "express";

import httpStatus from "http-status";
import { PrivacyTermsAboutUsService } from "./privacy_terms_aboutus.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create or update Privacy
const createOrUpdatePrivacy = catchAsync(
  async (req: Request, res: Response) => {
    const privacyData = req.body;
    const result = await PrivacyTermsAboutUsService.createOrUpdatePrivacy(
      privacyData
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "Privacy created/updated successfully.",
    });
  }
);

const getPrivacy = catchAsync(async (req: Request, res: Response) => {
  const result = await PrivacyTermsAboutUsService.getPrivacy();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Privacy fetched successfully.",
  });
});

// Create or update Terms
const createOrUpdateTerms = catchAsync(async (req: Request, res: Response) => {
  const termsData = req.body;
  const result = await PrivacyTermsAboutUsService.createOrUpdateTerms(
    termsData
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms created/updated successfully.",
  });
});

const getTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await PrivacyTermsAboutUsService.getTerms();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms fetched successfully.",
  });
});

// Create or update AboutUs
const createOrUpdateAboutUs = catchAsync(
  async (req: Request, res: Response) => {
    const aboutUsData = req.body;
    const result = await PrivacyTermsAboutUsService.createOrUpdateAboutUs(
      aboutUsData
    );
    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "AboutUs created/updated successfully.",
    });
  }
);

const getAboutUs = catchAsync(async (req: Request, res: Response) => {
  const result = await PrivacyTermsAboutUsService.getAboutUs();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "AboutUs fetched successfully.",
  });
});

export const PrivacyTermsAboutUsController = {
  createOrUpdatePrivacy,
  createOrUpdateTerms,
  createOrUpdateAboutUs,
  getPrivacy,
  getTerms,
  getAboutUs,
};
