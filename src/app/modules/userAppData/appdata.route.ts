import { Router } from "express";
import auth from "../../middleware/auth/auth";
import { AppDataController } from "./appdata.controller";

const router = Router();
router.post("/add-point", auth("USER"), AppDataController.addPoints);

export const AppDataRoute = router;
