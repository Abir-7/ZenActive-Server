"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const package_interface_1 = require("./package.interface");
const planSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    features: [
        {
            type: [String],
            required: true,
        },
    ],
    unitAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    interval: {
        type: String,
        enum: package_interface_1.interval,
    },
    productId: {
        type: String,
    },
    priceId: {
        type: String,
    },
    price: {
        type: Number,
    },
});
exports.Package = mongoose_1.default.model("Package", planSchema);
