"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendlist_interface_1 = require("./friendlist.interface");
const friendSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: Boolean, default: false },
    status: {
        type: String,
        enum: friendlist_interface_1.status,
        default: null,
    },
    statusChangeBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
const UserConnection = (0, mongoose_1.model)("UserConnection", friendSchema);
exports.default = UserConnection;
