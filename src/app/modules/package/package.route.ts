import { Router } from "express";
import auth from "../../middleware/auth/auth";

import validateRequest from "../../middleware/validator";
import { zodPackageSchema } from "./package.validation";
import { PackageController } from "./package.controller";

const router = Router();

router.post(
  "/create-package",
  validateRequest(zodPackageSchema),
  auth("ADMIN"),
  PackageController.createPackage
);
router.patch("/update/:id", auth("ADMIN"), PackageController.updatePackage);

router.get("/get-all-packages", PackageController.getAllPackage);
router.get("/:id", PackageController.getSinglePackage);
router.delete("/delete/:id", auth("ADMIN"), PackageController.deletePackage);

export const PackageRoute = router;
