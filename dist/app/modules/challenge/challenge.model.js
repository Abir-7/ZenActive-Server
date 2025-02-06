"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = void 0;
const mongoose_1 = require("mongoose");
const ChallengeSchema = new mongoose_1.Schema({
    challengeName: { type: String, required: true },
    duration: { type: String, required: true },
    rewardPoints: { type: Number, required: true },
    goal: { type: String, required: true },
    image: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
});
exports.Challenge = (0, mongoose_1.model)("Challenge", ChallengeSchema);
