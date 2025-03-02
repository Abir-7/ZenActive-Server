"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const s3_1 = __importDefault(require("./s3"));
const config_1 = require("../../config");
const unlinkFiles_1 = __importDefault(require("../unlinkFiles"));
/**
 * Uploads a file to AWS S3 and deletes it locally after upload or failure.
 * @param filePath - Local file path
 * @param fileName - Name to be stored in S3
 * @returns S3 file URL or null on failure
 */
const uploadFileToS3 = (filePath, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileContent = yield fs_extra_1.default.readFile(filePath);
        const params = {
            Bucket: config_1.config.aws.aws_bucket_name,
            Key: `${fileName}`, // Adjust S3 storage path
            Body: fileContent,
            ContentType: "video/mp4",
            ACL: "public-read", // Change this based on security needs
        };
        const uploadResult = yield s3_1.default.upload(params).promise();
        // Delete file after successful upload
        (0, unlinkFiles_1.default)(filePath);
        return uploadResult.Location;
    }
    catch (error) {
        (0, unlinkFiles_1.default)(filePath);
        return null;
    }
});
exports.uploadFileToS3 = uploadFileToS3;
