"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = require("mongoose");
const group_interface_1 = require("./group.interface");
const GroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: group_interface_1.groupTypes, required: true },
    goal: { type: String, required: true },
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, default: "" },
}, {
    timestamps: true,
});
exports.Group = (0, mongoose_1.model)("Group", GroupSchema);
