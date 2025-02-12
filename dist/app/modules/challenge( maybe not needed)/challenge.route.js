"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const parseDataMiddleware_1 = require("../../middleware/parseDataMiddleware");
const validator_1 = __importDefault(require("../../middleware/validator"));
const challenge_validation_1 = require("./challenge.validation");
const challenge_controller_1 = require("./challenge.controller");
const router = (0, express_1.Router)();
router.post("/create-challenge", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(challenge_validation_1.zodChallengeSchema), challenge_controller_1.ChallengeController.createChallenge);
router.patch("/:id", (0, auth_1.default)("ADMIN"), (0, fileUploadHandler_1.default)(), (0, parseDataMiddleware_1.parseField)("data"), (0, validator_1.default)(challenge_validation_1.zodUpdateChallengeSchema), challenge_controller_1.ChallengeController.updateChallenge);
router.get("/", (0, auth_1.default)("USER", "ADMIN"), // Adjust role if needed
challenge_controller_1.ChallengeController.getAllChallenges);
router.get("/:id", (0, auth_1.default)("USER", "ADMIN"), // Adjust role if needed
challenge_controller_1.ChallengeController.getSingleChallenge);
router.delete("/:id", (0, auth_1.default)("ADMIN"), challenge_controller_1.ChallengeController.deleteChallenge);
exports.ChallengeRoute = router;
