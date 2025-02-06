"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BadgeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    points: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
});
const Badge = (0, mongoose_1.model)("Badge", BadgeSchema);
exports.default = Badge;
