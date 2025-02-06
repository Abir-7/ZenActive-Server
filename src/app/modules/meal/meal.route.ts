import { Router } from "express";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import { MealController } from "./meal.controller";
import { parseField } from "../../middleware/parseDataMiddleware";
import auth from "../../middleware/auth/auth";
import validateRequest from "../../middleware/validator";
import { zodMealSchema, zodUpdateMealSchema } from "./meal.validation";

const router = Router();
router.post(
  "/create-meal",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodMealSchema),
  MealController.createMeal
);
router.patch(
  "/:id",
  auth("ADMIN"),
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUpdateMealSchema),
  MealController.updateMeal
);

router.delete("/:id", auth("ADMIN"), MealController.deleteMeal);

router.get("/", auth("ADMIN", "USER"), MealController.getAllMeals);

router.get("/:id", auth("ADMIN", "USER"), MealController.getSingleMeal);

export const MealRoute = router;
