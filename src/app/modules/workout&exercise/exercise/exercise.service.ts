import path from "path";
import mongoose, { Types } from "mongoose";
import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";

import DailyExercise from "../../usersDailyExercise/dailyExercise.model";
import { IExercise } from "./exercise.interface";
import Exercise from "./exercise.model";
import status from "http-status";
import { Request } from "express";

import { uploadToCloudinary } from "../../../utils/cloudinary/cloudinary";
import { sendPushNotification } from "../../notification/notification.service";
import { deleteCloudinaryVideo } from "../../../utils/cloudinary/deleteFile";
import { User } from "../../user/user.model";

// Create a new exercise
const createExercise = async (req: Request) => {
  let video = req.body.video || null;
  let image = req.body.image || null;
  let videoId = req.body.videoId || null;

  const uploadTasks: Promise<void>[] = [];

  // If files are provided, handle traditional upload (User -> Server -> Cloudinary)
  // Prepare Video Upload Task
  if (req.files && "media" in req.files && req.files.media[0]) {
    const file = req.files.media[0];
    const pathLink = `/medias/${file.filename}`;
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);

    uploadTasks.push((async () => {
      try {
        const uploadResult = await uploadToCloudinary(filePath, "exercises/videos", "video");
        video = uploadResult.secure_url;
        if (uploadResult.eager && uploadResult.eager[0]?.secure_url) {
          video = uploadResult.eager[0].secure_url;
        }
        videoId = uploadResult.public_id;
        unlinkFile(pathLink);
      } catch (error) {
        unlinkFile(pathLink);
        throw new AppError(500, "Video upload to Cloudinary failed");
      }
    })());
  }

  // Prepare Image Upload Task
  if (req.files && "image" in req.files && req.files.image[0]) {
    const file = req.files.image[0];
    const pathLink = `/images/${file.filename}`;
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);

    uploadTasks.push((async () => {
      try {
        const uploadResult = await uploadToCloudinary(filePath, "exercises/images", "image");
        image = uploadResult.secure_url;
        unlinkFile(pathLink);
      } catch (error) {
        unlinkFile(pathLink);
        throw new AppError(500, "Image upload to Cloudinary failed");
      }
    })());
  }

  // Execute all uploads in parallel
  if (uploadTasks.length > 0) {
    await Promise.all(uploadTasks);
  }

  const value = {
    ...req.body,
    video,
    image,
    videoId,
  } as IExercise;

  const exercise = await Exercise.create({
    ...value,
    duration: Number(value.duration * 60),
  });

  if (!exercise) {
    if (videoId) await deleteCloudinaryVideo(videoId, "video");
  }

  // Safely send push notification without blocking response
  sendPushNotification({
    title: "New Exercise",
    body: `New exercise added: ${value.name}`,
  }).catch((err) => console.error("Notification trigger failed:", err));

  return exercise;
};

const getAllExercise = async (
  userRole: string,
  userId: string,
  page: number = 1,
  limit: number = 12,
  query?: Record<string, unknown>
) => {
  if (!query?.name) {
    delete query?.name;
  }

  console.log(query);

  query!.isDeleted = false;

  const skip = (page - 1) * limit;

  if (userRole === "ADMIN") {
    query = { isDeleted: false, ...query };

    if (typeof query.name === "string" && query.name.trim() !== "") {
      // Add a case-insensitive regex search for the name field
      query.name = { $regex: query.name, $options: "i" };
    }

    const total = await Exercise.countDocuments(query);
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.find(query).skip(skip).limit(limit).exec();

    return {
      meta: { limit, page, total, totalPage },
      data: exercises,
    };
  } else {
    // Calculate today's boundaries.
    const query: { isDeleted?: boolean; isPremium?: boolean } = {
      isDeleted: false,
      isPremium: false,
    };
    const userData = await User.findOne({ _id: userId });

    if (userData?.hasPremiumAccess) {
      delete query.isPremium;
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get total count for pagination
    const total = await Exercise.countDocuments(query);
    const totalPage = Math.ceil(total / limit);

    const exercises = await Exercise.aggregate([
      { $match: query },
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
const getExerciseById = async (exerciseId: string, userId: string) => {
  const isUser = await User.findOne({ _id: userId });

  if (isUser?.hasPremiumAccess === false) {
    throw new AppError(500, "User don't have premium access.");
  }

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

  let video = req.body.video || null;
  let image = req.body.image || null;
  let videoId = req.body.videoId || null;

  const uploadTasks: Promise<void>[] = [];

  // Prepare Video Update Task (Traditional)
  if (req.files && "media" in req.files && req.files.media[0]) {
    const file = req.files.media[0];
    const pathLink = `/medias/${file.filename}`;
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);

    uploadTasks.push((async () => {
      try {
        const uploadResult = await uploadToCloudinary(filePath, "exercises/videos", "video");
        video = uploadResult.secure_url;
        if (uploadResult.eager && uploadResult.eager[0]?.secure_url) {
          video = uploadResult.eager[0].secure_url;
        }
        videoId = uploadResult.public_id;
        unlinkFile(pathLink);
        if (isExist.videoId) {
          await deleteCloudinaryVideo(isExist.videoId, "video");
        }
      } catch (error) {
        unlinkFile(pathLink);
        throw new AppError(500, "Video upload to Cloudinary failed");
      }
    })());
  }

  // Prepare Image Update Task
  if (req.files && "image" in req.files && req.files.image[0]) {
    const file = req.files.image[0];
    const pathLink = `/images/${file.filename}`;
    const filePath = path.join(process.cwd(), `/uploads/${pathLink}`);

    uploadTasks.push((async () => {
      try {
        const uploadResult = await uploadToCloudinary(filePath, "exercises/images", "image");
        image = uploadResult.secure_url;
        unlinkFile(pathLink);
      } catch (error) {
        unlinkFile(pathLink);
        throw new AppError(500, "Image upload to Cloudinary failed");
      }
    })());
  }

  if (uploadTasks.length > 0) {
    await Promise.all(uploadTasks);
  }

  let value = req.body as Partial<IExercise>;

  if (image) {
    value = { ...value, image };
    if (isExist.image && !isExist.image.startsWith("http")) {
      unlinkFile(isExist.image);
    }
  }
  
  if (video && videoId) {
    value = { ...value, video, videoId };
  }

  if (value.duration) {
    value.duration = Number(value.duration) * 60;
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

  // if (isExist.video) {
  //   const publicId = extractPublicId(isExist.video);
  //   await deleteCloudinaryVideo(publicId, "video");
  // }

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
