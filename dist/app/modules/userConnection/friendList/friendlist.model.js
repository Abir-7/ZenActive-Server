"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: Boolean, default: false },
}, { timestamps: true });
const Friend = (0, mongoose_1.model)("Friend", friendSchema);
exports.default = Friend;
