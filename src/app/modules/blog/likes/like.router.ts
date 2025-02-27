import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { LikeController } from "./like.controller";
import validateRequest from "../../../middleware/validator";
import { zodLikeSchema } from "./like.validation";

const router = Router();

router.post(
  "/toggle-like",
  auth("USER"),
  validateRequest(zodLikeSchema),
  LikeController.toggleLike
);

export const LikeRoute = router;
