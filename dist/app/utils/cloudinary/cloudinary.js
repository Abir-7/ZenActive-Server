"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryInstance = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("../../config");
cloudinary_1.v2.config({
    cloud_name: config_1.config.cloudinary.cloud_name,
    api_key: config_1.config.cloudinary.api_key,
    api_secret: config_1.config.cloudinary.api_secret,
});
exports.cloudinaryInstance = cloudinary_1.v2;
