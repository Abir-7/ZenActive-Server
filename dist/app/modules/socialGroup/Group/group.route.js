"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRoute = void 0;
const express_1 = require("express");
const group_validation_1 = require("./group.validation");
const group_controller_1 = require("./group.controller");
const validator_1 = __importDefault(require("../../../middleware/validator"));
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const fileUploadHandler_1 = __importDefault(require("../../../middleware/fileUploadHandler"));
const parseDataMiddleware_1 = require("../../../middleware/parseDataMiddleware");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)("USER"), group_controller_1.GroupController.getAllGroup);
router.post("/create-group", (0, validator_1.default)(group_validation_1.zodGroupSchema), (0, auth_1.default)("USER"), group_controller_1.GroupController.createGroup);
router.patch("/:groupId", (0, auth_1.default)("USER"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(group_validation_1.zodUpdateGroupSchema), group_controller_1.GroupController.updateGroup);
router.delete("/:groupId", (0, auth_1.default)("USER"), group_controller_1.GroupController.deleteGroup);
router.get("/:groupId", (0, auth_1.default)("USER"), group_controller_1.GroupController.getSingleGroupData);
exports.GroupRoute = router;
