import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import httpStatus from "http-status";
import { PackageService } from "./package.service";

const createPackage = catchAsync(async (req, res) => {
  const result = await PackageService.createPackage(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription is created",
  });
});

const getAllPackage = catchAsync(async (req, res) => {
  const result = await PackageService.getAllPackage();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Package retrived successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req, res) => {
  const result = await PackageService.updatePackage(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Package updated successfully",
    data: result,
  });
});

const getSinglePackage = catchAsync(async (req, res) => {
  const result = await PackageService.getPackageById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single-Package retrived successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req, res) => {
  const result = await PackageService.deletePackage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Package deleted successfully",
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackage,
  updatePackage,
  getSinglePackage,
  deletePackage,
};
