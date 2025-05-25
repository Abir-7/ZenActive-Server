import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validator";
import { zodCreateUserSchema, zodUserUpdateSchema } from "./user.validation";
import auth from "../../middleware/auth/auth";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import { parseField } from "../../middleware/parseDataMiddleware";

const router = Router();

router.get("/", auth("ADMIN", "USER"), UserController.getAllUsers);
router.get("/me", auth("ADMIN", "USER"), UserController.getMydata);
router.get("/total-user", auth("ADMIN"), UserController.getTotalUserCount);
router.get("/:id", auth("ADMIN", "USER"), UserController.getSingleUser);
router.post(
  "/create-user",
  validateRequest(zodCreateUserSchema),
  UserController.createUser
);
router.patch(
  "/update-user",
  fileUploadHandler(),
  parseField("data"),
  validateRequest(zodUserUpdateSchema),

  auth("USER", "ADMIN"),
  UserController.updateUserInfo
);
router.patch("/block/:id", auth("ADMIN"), UserController.blockUser);
router.delete("/delete/:id", auth("ADMIN"), UserController.deleteUser);
router.delete("/delete-me", auth("USER"), UserController.deleteMe);

export const UserRoute = router;
