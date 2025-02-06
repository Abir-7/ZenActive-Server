"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const fileUploadHandler = () => {
    const baseUploadDir = path_1.default.join(process.cwd(), "uploads");
    if (!fs_1.default.existsSync(baseUploadDir)) {
        fs_1.default.mkdirSync(baseUploadDir);
    }
    const createDir = (dirPath) => {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    };
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir;
            switch (file.fieldname) {
                case "image":
                    uploadDir = path_1.default.join(baseUploadDir, "images");
                    break;
                case "gifImage":
                    uploadDir = path_1.default.join(baseUploadDir, "gifImages");
                    break;
                case "media":
                    uploadDir = path_1.default.join(baseUploadDir, "medias");
                    break;
                case "doc":
                    uploadDir = path_1.default.join(baseUploadDir, "docs");
                    break;
                default:
                    throw new AppError_1.default(500, "File is not supported");
            }
            createDir(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
                "-" +
                Date.now();
            cb(null, fileName + fileExt);
        },
    });
    //file filter
    const filterFilter = (req, file, cb) => {
        if (file.fieldname === "image") {
            if (file.mimetype === "image/jpeg" ||
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/webp") {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(500, "Only .jpeg, .png, .jpg file supported"));
            }
        }
        else if (file.fieldname === "media") {
            if (file.mimetype === "video/mp4" || file.mimetype === "audio/mpeg") {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(500, "Only .mp4, .mp3, file supported"));
            }
        }
        else if (file.fieldname === "doc") {
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(500, "Only pdf supported"));
            }
        }
        else if (file.fieldname === "gifImage") {
            if (file.mimetype === "image/gif") {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default(500, "Only gif supported"));
            }
        }
        else {
            throw new AppError_1.default(500, "This file is not supported");
        }
    };
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: filterFilter,
    }).fields([
        { name: "image", maxCount: 3 },
        { name: "media", maxCount: 3 },
        { name: "doc", maxCount: 3 },
        { name: "gifImage", maxCount: 3 },
    ]);
    return upload;
};
exports.default = fileUploadHandler;
