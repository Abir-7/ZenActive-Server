"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoute = void 0;
const express_1 = require("express");
const package_validation_1 = require("./package.validation");
const package_controller_1 = require("./package.controller");
const validator_1 = __importDefault(require("../../../middleware/validator"));
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const router = (0, express_1.Router)();
router.post("/create-package", (0, validator_1.default)(package_validation_1.zodPackageSchema), (0, auth_1.default)("ADMIN"), package_controller_1.PackageController.createPackage);
router.patch("/update/:id", (0, auth_1.default)("ADMIN"), package_controller_1.PackageController.updatePackage);
router.get("/get-all-packages", package_controller_1.PackageController.getAllPackage);
router.get("/:id", package_controller_1.PackageController.getSinglePackage);
router.delete("/delete/:id", (0, auth_1.default)("ADMIN"), package_controller_1.PackageController.deletePackage);
exports.PackageRoute = router;
