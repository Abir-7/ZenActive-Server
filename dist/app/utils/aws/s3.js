"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../../config");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.config.aws.aws_access_key,
    secretAccessKey: config_1.config.aws.aws_secret_access_key,
    region: config_1.config.aws.aws_region,
});
exports.default = s3;
