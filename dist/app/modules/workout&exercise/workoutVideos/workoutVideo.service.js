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
exports.WorkoutVideoService = void 0;
const path_1 = __importDefault(require("path"));
const workoutVideo_model_1 = require("./workoutVideo.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const cloudinary_1 = require("../../../utils/cloudinary/cloudinary");
const get_video_duration_1 = __importDefault(require("get-video-duration"));
const getPublicID_1 = require("../../../utils/cloudinary/getPublicID");
const deleteFile_1 = require("../../../utils/cloudinary/deleteFile");
const getAllWorkoutVideos = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    // Step 1: Get total count for pagination
    const total = yield workoutVideo_model_1.WorkoutVideo.countDocuments();
    const totalPage = Math.ceil(total / limit);
    // Step 2: Fetch paginated workout videos
    const workoutVideos = yield workoutVideo_model_1.WorkoutVideo.find()
        .skip(skip)
        .limit(limit)
        .exec();
    return {
        meta: { limit, page, total, totalPage },
        data: workoutVideos,
    };
});
const getSingleWorkoutVideos = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield workoutVideo_model_1.WorkoutVideo.findOne({ _id: id }).exec();
    if (!data) {
        throw new AppError_1.default(404, "Video data not found");
    }
    return data;
});
const createWorkoutVideo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let video = null;
    let image = null;
    let duration = null;
    if (req.files && "media" in req.files && req.files.media[0]) {
        // const s3Url = await uploadFileToS3(filePath, file.filename);
        // if (s3Url) {
        //   video = s3Url;
        // } else {
        //   throw new AppError(500, "Video upload faield");
        // }
        const pathLink = `/medias/${req.files.media[0].filename}`;
        const file = req.files.media[0];
        const filePath = path_1.default.join(process.cwd(), `/uploads/${pathLink}`);
        try {
            const uploadResult = yield cloudinary_1.cloudinaryInstance.uploader.upload(filePath, {
                public_id: file.filename.split(".")[0].trim(),
                folder: "videos",
                resource_type: "video",
                eager: [
                    {
                        width: 1280,
                        height: 720,
                        crop: "scale",
                        quality: "auto",
                    },
                ],
                eager_async: true,
            });
            video = uploadResult.secure_url; // Cloudinary URL
            if (uploadResult.eager[0].secure_url) {
                video = uploadResult.eager[0].secure_url;
            }
            yield (0, get_video_duration_1.default)(req.files.media[0].path)
                .then((durations) => {
                duration = durations;
            })
                .catch((error) => {
                throw new Error("Failed to get duration");
            });
            // Delete local file after upload
            (0, unlinkFiles_1.default)(pathLink);
        }
        catch (error) {
            console.log(error);
            (0, unlinkFiles_1.default)(pathLink);
            throw new AppError_1.default(500, "Video upload to Cloudinary failed");
        }
    }
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { video,
        image,
        duration });
    if (!image || !video) {
        throw new AppError_1.default(500, "Faield to  upload video/image");
    }
    const workoutVideo = yield workoutVideo_model_1.WorkoutVideo.create(value);
    return workoutVideo;
});
const updateWorkoutVideo = (id, 
// payload: Partial<IWorkoutVideo>
req) => __awaiter(void 0, void 0, void 0, function* () {
    const isWorkoutVideo = yield workoutVideo_model_1.WorkoutVideo.findById(id).exec();
    if (!isWorkoutVideo) {
        throw new AppError_1.default(404, "Workout video not found or already deleted.");
    }
    let video = null;
    let image = null;
    let duration = null;
    if (req.files && "media" in req.files && req.files.media[0]) {
        const pathLink = `/medias/${req.files.media[0].filename}`;
        const file = req.files.media[0];
        const filePath = path_1.default.join(process.cwd(), `/uploads/${pathLink}`);
        console.log(file.filename.split(".")[0]);
        try {
            const uploadResult = yield cloudinary_1.cloudinaryInstance.uploader.upload(filePath, {
                public_id: file.filename.split(".")[0].trim(),
                folder: "videos",
                resource_type: "video",
                eager: [
                    {
                        width: 1280,
                        height: 720,
                        crop: "scale",
                        quality: "auto",
                    },
                ],
                eager_async: true,
            });
            video = uploadResult.secure_url; // Cloudinary URL
            if (uploadResult.eager[0].secure_url) {
                video = uploadResult.eager[0].secure_url;
            }
            yield (0, get_video_duration_1.default)(req.files.media[0].path)
                .then((durations) => {
                duration = durations;
            })
                .catch((error) => {
                throw new Error("Failed to get duration");
            });
            // Delete local file after upload
            (0, unlinkFiles_1.default)(pathLink);
            const videoLink = isWorkoutVideo.video;
            const publicId = (0, getPublicID_1.extractPublicId)(videoLink);
            yield (0, deleteFile_1.deleteCloudinaryVideo)(publicId, "video");
        }
        catch (error) {
            (0, unlinkFiles_1.default)(pathLink);
            throw new AppError_1.default(500, "Video upload to Cloudinary failed");
        }
    }
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    let value = req.body;
    if (image) {
        value = Object.assign(Object.assign({}, value), { image });
        (0, unlinkFiles_1.default)(isWorkoutVideo.image);
    }
    if (video) {
        value = Object.assign(Object.assign({}, value), { video });
    }
    const updatedWorkout = yield workoutVideo_model_1.WorkoutVideo.findByIdAndUpdate(id, value, {
        new: true,
    }).exec();
    return updatedWorkout;
});
const deleteWorkoutVideo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedWorkout = yield workoutVideo_model_1.WorkoutVideo.findByIdAndDelete(id).exec();
    if (!deletedWorkout) {
        throw new AppError_1.default(404, "Workout video not found or already deleted.");
    }
    return deletedWorkout;
});
exports.WorkoutVideoService = {
    getAllWorkoutVideos,
    createWorkoutVideo,
    updateWorkoutVideo,
    deleteWorkoutVideo,
    getSingleWorkoutVideos,
};
