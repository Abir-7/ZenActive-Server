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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCloudinaryVideo = void 0;
const cloudinary_1 = require("./cloudinary");
const deleteCloudinaryVideo = (publicId, resource_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cloudinary_1.cloudinaryInstance.uploader.destroy(publicId.trim(), {
            resource_type: resource_type,
            invalidate: true,
        });
        if (response.result === "ok") {
            console.log("Video deleted successfully.");
        }
        else {
            console.error("Failed to delete video.");
        }
    }
    catch (error) {
        console.error("Error deleting video:", error);
    }
});
exports.deleteCloudinaryVideo = deleteCloudinaryVideo;
