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
exports.ExerciseService = void 0;
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const dailyExercise_model_1 = __importDefault(require("../../usersDailyExercise/dailyExercise.model"));
const exercise_model_1 = __importDefault(require("./exercise.model"));
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_1 = require("../../../utils/cloudinary/cloudinary");
const getPublicID_1 = require("../../../utils/cloudinary/getPublicID");
const deleteFile_1 = require("../../../utils/cloudinary/deleteFile");
const get_video_duration_1 = __importDefault(require("get-video-duration"));
// Create a new exercise
const createExercise = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
            // console.log(error);
            (0, unlinkFiles_1.default)(pathLink);
            throw new AppError_1.default(500, "Video upload to Cloudinary failed");
        }
    }
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { video,
        image });
    const exercise = yield exercise_model_1.default.create(Object.assign(Object.assign({}, value), { duration: Number(value.duration * 60) }));
    if (!exercise && value.image) {
        (0, unlinkFiles_1.default)(value.image);
    }
    return exercise;
});
const getAllExercise = (userRole_1, userId_1, ...args_1) => __awaiter(void 0, [userRole_1, userId_1, ...args_1], void 0, function* (userRole, userId, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    if (userRole === "ADMIN") {
        // Get total count for pagination
        const total = yield exercise_model_1.default.countDocuments({ isDeleted: false });
        const totalPage = Math.ceil(total / limit);
        const exercises = yield exercise_model_1.default.find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .exec();
        return {
            meta: { limit, page, total, totalPage },
            data: exercises,
        };
    }
    else {
        // Calculate today's boundaries.
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // Get total count for pagination
        const total = yield exercise_model_1.default.countDocuments({ isDeleted: false });
        const totalPage = Math.ceil(total / limit);
        const exercises = yield exercise_model_1.default.aggregate([
            { $match: { isDeleted: false } },
            {
                $lookup: {
                    from: "dailyexercises",
                    let: { exerciseId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$exerciseId", "$$exerciseId"] },
                                        { $eq: ["$userId", new mongoose_1.default.Types.ObjectId(userId)] },
                                        { $gte: ["$completedDate", startOfToday] },
                                        { $lte: ["$completedDate", endOfToday] },
                                    ],
                                },
                            },
                        },
                        { $project: { _id: 1 } },
                    ],
                    as: "dailyExercise",
                },
            },
            {
                $addFields: { isCompleted: { $gt: [{ $size: "$dailyExercise" }, 0] } },
            },
            { $project: { dailyExercise: 0 } },
            { $skip: skip },
            { $limit: limit },
        ]);
        return {
            meta: { limit, page, total, totalPage },
            data: exercises,
        };
    }
});
// Get an exercise by ID
const getExerciseById = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // End of today
    const [participantCount, exercise] = yield Promise.all([
        dailyExercise_model_1.default.countDocuments({
            exerciseId,
            completedDate: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        }),
        exercise_model_1.default.findById(exerciseId).exec(),
    ]);
    if (!exercise) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exercise not found.");
    }
    return { exercise, participant: participantCount };
});
// Update an exercise by ID
const updateExercise = (exerciseId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findById(exerciseId);
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
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
            const videoLink = isExist.video;
            const publicId = (0, getPublicID_1.extractPublicId)(videoLink);
            yield (0, deleteFile_1.deleteCloudinaryVideo)(publicId, "video");
        }
        catch (error) {
            // console.log(error);
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
        (0, unlinkFiles_1.default)(isExist.image);
    }
    if (video) {
        value = Object.assign(Object.assign({}, value), { video });
    }
    const updated = yield exercise_model_1.default.findByIdAndUpdate(exerciseId, value, {
        new: true,
    }).exec();
    if (!(updated === null || updated === void 0 ? void 0 : updated._id)) {
        throw new AppError_1.default(404, "Failed to Update");
    }
    return updated;
});
const deleteExercise = (exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exercise_model_1.default.findByIdAndUpdate(exerciseId, { isDeleted: true }, { new: true });
    if (!(isExist === null || isExist === void 0 ? void 0 : isExist._id)) {
        throw new AppError_1.default(404, "Workout not found.");
    }
    return { message: "Exercise deleted" };
});
// Group all service functions into an object
exports.ExerciseService = {
    createExercise,
    getAllExercise,
    getExerciseById,
    updateExercise,
    deleteExercise,
};
