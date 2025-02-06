"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendListRoute = void 0;
const express_1 = __importDefault(require("express"));
const friendlist_controller_1 = require("./friendlist.controller");
const auth_1 = __importDefault(require("../../../middleware/auth/auth"));
const validator_1 = __importDefault(require("../../../middleware/validator"));
const friendlist_validation_1 = require("./friendlist.validation");
const router = express_1.default.Router();
router.post("/send-request", (0, validator_1.default)(friendlist_validation_1.zodFriendListSchema), (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.addFriend);
router.patch("/accept-request", (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.acceteptRequest);
router.patch("/remove", (0, validator_1.default)(friendlist_validation_1.zodFriendListSchema), (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.removeFriend);
router.get("/", (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.getFriendList);
router.get("/pending", (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.getPendingList);
router.get("/suggested", (0, auth_1.default)("USER"), friendlist_controller_1.FriendListController.getSugestedFriend);
exports.FriendListRoute = router;
