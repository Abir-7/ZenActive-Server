import { Router } from "express";
import { BlockController } from "./blocklist.controller";
import auth from "../../../middleware/auth/auth";
import validateRequest from "../../../middleware/validator";
import { zodBlockSchema } from "./blocklist.validation";

const router = Router();

router.post(
  "/add",
  auth("USER"),
  validateRequest(zodBlockSchema),
  BlockController.addToBlock
),
  router.patch(
    "/remove",
    auth("USER"),
    validateRequest(zodBlockSchema),
    BlockController.deleteFromBlock
  );
router.get("/", auth("USER"), BlockController.getBlockList);
export const BlockRoute = router;
