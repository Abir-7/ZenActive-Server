"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const mongoose_1 = require("mongoose");
const BlockSchema = new mongoose_1.Schema({
    blockedUser: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, default: [] },
    ],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.Block = (0, mongoose_1.model)("Block", BlockSchema);
