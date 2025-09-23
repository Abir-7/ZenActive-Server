import express from "express";
import { UserMealPlanController } from "./userMealPlan.controller";
import auth from "../../middleware/auth/auth";

const router = express.Router();

router.post("/", auth("USER"), UserMealPlanController.createUserMealPlan);
router.get("/", auth("USER"), UserMealPlanController.getUserMealPlans);
router.get(
  "/by-time",
  auth("USER"),
  UserMealPlanController.getUserMealPlansByMealTime
);
// router.get("/details/:id", UserMealPlanController.getUserMealPlanById);
router.patch(
  "/:mealId",
  auth("USER"),
  UserMealPlanController.updateUserMealPlan
);
router.delete("/:id", auth("USER"), UserMealPlanController.deleteUserMealPlan);

export const UserMealPlanRoute = router;
