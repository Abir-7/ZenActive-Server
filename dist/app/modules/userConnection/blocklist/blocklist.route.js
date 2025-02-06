"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRoute = void 0;
const express_1 = require("express");
const blocklist_controller_1 = require("./blocklist.controller");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../../middleware/validator"));
const blocklist_validation_1 = require("./blocklist.validation");
const router = (0, express_1.Router)();
router.post("/add", (0, auth_1.default)("USER"), (0, validator_1.default)(blocklist_validation_1.zodBlockSchema), blocklist_controller_1.BlockController.addToBlock),
    router.patch("/remove", (0, auth_1.default)("USER"), (0, validator_1.default)(blocklist_validation_1.zodBlockSchema), blocklist_controller_1.BlockController.deleteFromBlock);
router.get("/", (0, auth_1.default)("USER"), blocklist_controller_1.BlockController.getBlockList);
exports.BlockRoute = router;
