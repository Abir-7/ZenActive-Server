import { Request } from "express";
import fs from "fs";

import multer, { FileFilterCallback } from "multer";
import path from "path";
import AppError from "../errors/AppError";

const fileUploadHandler = () => {
  const baseUploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case "image":
          uploadDir = path.join(baseUploadDir, "images");
          break;
        case "gifImage":
          uploadDir = path.join(baseUploadDir, "gifImages");
          break;
        case "media":
          uploadDir = path.join(baseUploadDir, "medias");
          break;
        case "doc":
          uploadDir = path.join(baseUploadDir, "docs");
          break;
        default:
          throw new AppError(500, "File is not supported");
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
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
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === "image") {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(new AppError(500, "Only .jpeg, .png, .jpg file supported"));
      }
    } else if (file.fieldname === "media") {
      if (file.mimetype === "video/mp4" || file.mimetype === "audio/mpeg") {
        cb(null, true);
      } else {
        cb(new AppError(500, "Only .mp4 file supported")); //, .mp3,
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new AppError(500, "Only pdf supported"));
      }
    } else if (file.fieldname === "gifImage") {
      if (file.mimetype === "image/gif") {
        cb(null, true);
      } else {
        cb(new AppError(500, "Only gif supported"));
      }
    } else {
      throw new AppError(500, "This file is not supported");
    }
  };

  const upload = multer({
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

export default fileUploadHandler;
