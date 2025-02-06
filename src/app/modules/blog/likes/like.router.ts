import { Router } from "express";
import auth from "../../../middleware/auth/auth";
import { LikeController } from "./like.controller";

const router = Router();

router.post("/toggle-like", auth("USER"), LikeController.toggleLike);

export const LikeRoute = router;
