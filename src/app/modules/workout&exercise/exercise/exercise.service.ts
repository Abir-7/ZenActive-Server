import path from "path";
import mongoose, { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";

import DailyExercise from "../../usersDailyExercise/dailyExercise.model";
import { IExercise } from "./exercise.interface";
import Exercise from "./exercise.model";
import status from "http-status";
import { Request } from "express";

import { cloudinaryInstance } from "../../../utils/cloudinary/cloudinary";
import { extractPublicId } from "../../../utils/cloudinary/getPublicID";
import { deleteCloudinaryVideo } from "../../../utils/cloudinary/deleteFile";
import getVideoDurationInSeconds from "get-video-duration";

// Create a new exercise
const createExercise = async (req: Request) => {
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
      }

      await getVideoDurationInSeconds(req.files.media[0].path)
        .then((durations: number) => {
          duration = durations;
        })
        .catch((error: any) => {
          throw new Error("Failed to get duration");
        });

      // Delete local file after upload
      unlinkFile(pathLink);
    } catch (error) {
      // console.log(error);
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
  } as IExercise;

  const exercise = await Exercise.create({
    ...value,
    duration: Number(value.duration * 60),
  });
  if (!exercise && value.image) {
    unlinkFile(value.image);
  }
  return exercise;
};

const getAllExercise = async (
  userRole: string,
  userId: string,
  page: number = 1,
  limit: number = 12
) => {
  const skip = (page - 1) * limit;

  if (userRole === "ADMIN") {
    // Get total count for pagination
    const total = await Exercise.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      meta: { limit, page, total, totalPage },
      data: exercises,
    };
  } else {
    // Calculate today's boundaries.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get total count for pagination
    const total = await Exercise.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.aggregate([
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
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
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
};
// Get an exercise by ID
const getExerciseById = async (exerciseId: string) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Start of today
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // End of today

  const [participantCount, exercise] = await Promise.all([
    DailyExercise.countDocuments({
      exerciseId,
      completedDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }),
    Exercise.findById(exerciseId).exec(),
  ]);

  if (!exercise) {
    throw new AppError(status.NOT_FOUND, "Exercise not found.");
  }

  return { exercise, participant: participantCount };
};

// Update an exercise by ID
const updateExercise = async (exerciseId: string, req: Request) => {
  const isExist = await Exercise.findById(exerciseId);

  if (!isExist?._id) {
    throw new AppError(404, "Workout not found.");
  }

  let video = null;
  let image = null;
  let duration = null;
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
      }

      await getVideoDurationInSeconds(req.files.media[0].path)
        .then((durations: number) => {
          duration = durations;
        })
        .catch((error: any) => {
          throw new Error("Failed to get duration");
        });

      // Delete local file after upload
      unlinkFile(pathLink);

      const videoLink = isExist.video;
      const publicId = extractPublicId(videoLink);
      await deleteCloudinaryVideo(publicId, "video");
    } catch (error) {
      // console.log(error);
      unlinkFile(pathLink);
      throw new AppError(500, "Video upload to Cloudinary failed");
    }
  }

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  let value = req.body as Partial<IExercise>;

  if (image) {
    value = { ...value, image };
    unlinkFile(isExist.image);
  }
  if (video) {
    value = { ...value, video };
  }

  const updated = await Exercise.findByIdAndUpdate(exerciseId, value, {
    new: true,
  }).exec();

  if (!updated?._id) {
    throw new AppError(404, "Failed to Update");
  }
  return updated;
};

const deleteExercise = async (exerciseId: string) => {
  const isExist = await Exercise.findByIdAndUpdate(
    exerciseId,
    { isDeleted: true },
    { new: true }
  );
  if (!isExist?._id) {
    throw new AppError(404, "Workout not found.");
  }

  return { message: "Exercise deleted" };
};

// Group all service functions into an object
export const ExerciseService = {
  createExercise,
  getAllExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
