import path from "path";
import { WorkoutVideo } from "./workoutVideo.model";
import { IWorkoutVideo } from "./workoutVideo.interface";

import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";
import { Request } from "express";
import { cloudinaryInstance } from "../../../utils/cloudinary/cloudinary";

import { extractPublicId } from "../../../utils/cloudinary/getPublicID";
import { deleteCloudinaryVideo } from "../../../utils/cloudinary/deleteFile";

const getAllWorkoutVideos = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const total = await WorkoutVideo.countDocuments();
  const totalPage = Math.ceil(total / limit);

  const workoutVideos = await WorkoutVideo.find()
    .skip(skip)
    .limit(limit)
    .exec();
  return {
    meta: { limit, page, total, totalPage },
    data: workoutVideos,
  };
};
const getSingleWorkoutVideos = async (id: string) => {
  const data = await WorkoutVideo.findOne({ _id: id }).exec();
  if (!data) {
    throw new AppError(404, "Video data not found");
  }
  return data;
};

const createWorkoutVideo = async (req: Request) => {
  let video = null;
  let image = null;
  let duration = null;
  let videoId = null;
  if (req.files && "media" in req.files && req.files.media[0]) {
    const pathLink = `/medias/${req.files.media[0].filename}`;
    const file = req.files.media[0];
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);
    try {
      const uploadResult = await cloudinaryInstance.uploader.upload(filePath, {
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

        videoId = uploadResult.public_id;
      }
      duration = uploadResult.duration;

      unlinkFile(pathLink);
    } catch (error) {
      console.log(error);
      unlinkFile(pathLink);
      throw new AppError(500, "Video upload to Cloudinary failed");
    }
  }

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    video,
    image,
    duration,
    videoId,
  } as IWorkoutVideo;
  if (!image || !video) {
    throw new AppError(500, "Faield to  upload video/image");
  }
  const workoutVideo = await WorkoutVideo.create(value);
  return workoutVideo;
};

const updateWorkoutVideo = async (id: string, req: Request) => {
  const isWorkoutVideo = await WorkoutVideo.findById(id).exec();
  if (!isWorkoutVideo) {
    throw new AppError(404, "Workout video not found or already deleted.");
  }
  let video = null;
  let image = null;
  let duration = null;
  let videoId = null;
  if (req.files && "media" in req.files && req.files.media[0]) {
    const pathLink = `/medias/${req.files.media[0].filename}`;
    const file = req.files.media[0];
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);
    console.log(file.filename.split(".")[0]);
    try {
      const uploadResult = await cloudinaryInstance.uploader.upload(filePath, {
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

        videoId = uploadResult.public_id;
      }
      duration = uploadResult.duration;
      unlinkFile(pathLink);
      const videoLink = isWorkoutVideo.video;
      const publicId = extractPublicId(videoLink);
      await deleteCloudinaryVideo(publicId, "video");
    } catch (error) {
      unlinkFile(pathLink);
      throw new AppError(500, "Video upload to Cloudinary failed");
    }
  }

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  let value = req.body as Partial<IWorkoutVideo>;
  if (image) {
    value = { ...value, image };
    unlinkFile(isWorkoutVideo.image);
  }
  if (video && videoId) {
    value = { ...value, video, videoId, duration };
  }
  const updatedWorkout = await WorkoutVideo.findByIdAndUpdate(id, value, {
    new: true,
  }).exec();
  return updatedWorkout;
};

const deleteWorkoutVideo = async (id: string) => {
  const isExist = await WorkoutVideo.findById(id);
  if (isExist?.video) {
    await deleteCloudinaryVideo(isExist.videoId, "video");
  }

  const deletedWorkout = await WorkoutVideo.findByIdAndDelete(id).exec();

  if (!deletedWorkout) {
    throw new AppError(404, "Workout video not found or already deleted.");
  }
  return deletedWorkout;
};

export const WorkoutVideoService = {
  getAllWorkoutVideos,
  createWorkoutVideo,
  updateWorkoutVideo,
  deleteWorkoutVideo,
  getSingleWorkoutVideos,
};
