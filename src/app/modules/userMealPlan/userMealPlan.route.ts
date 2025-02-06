import express from "express";
import { UserMealPlanController } from "./userMealPlan.controller";
import auth from "../../middleware/auth/auth";

const router = express.Router();

router.post("/", auth("USER"), UserMealPlanController.createUserMealPlan);
router.get("/", auth("USER"), UserMealPlanController.getUserMealPlans);
// router.get("/details/:id", UserMealPlanController.getUserMealPlanById);
router.patch("/:id", auth("USER"), UserMealPlanController.updateUserMealPlan);
router.delete("/:id", auth("USER"), UserMealPlanController.deleteUserMealPlan);

export const UserMealPlanRoute = router;
