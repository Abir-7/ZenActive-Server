"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadge = void 0;
const mongoose_1 = require("mongoose");
const userBadgeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    badgeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Badge",
        required: true,
    },
});
exports.UserBadge = (0, mongoose_1.model)("UserBadge", userBadgeSchema);
