import { WorkoutVideo } from "./workoutVideo.model";
import { IWorkoutVideo } from "./workoutVideo.interface";
import createHttpError from "http-errors";
import AppError from "../../../errors/AppError";
import unlinkFile from "../../../utils/unlinkFiles";

const getAllWorkoutVideos = async () => {
  return await WorkoutVideo.find().exec();
};

const getSingleWorkoutVideos = async (id: string) => {
  const data = await WorkoutVideo.findOne({ _id: id }).exec();
  if (!data) {
    throw new AppError(404, "Video data not found");
  }
  return data;
};

const createWorkoutVideo = async (payload: IWorkoutVideo) => {
  const workoutVideo = await WorkoutVideo.create(payload);
  if (!workoutVideo) {
    unlinkFile(payload.video);
    unlinkFile(payload.image);
  }
  return workoutVideo;
};

const updateWorkoutVideo = async (
  id: string,
  payload: Partial<IWorkoutVideo>
) => {
  const isWorkoutVideo = await WorkoutVideo.findById(id).exec();
  if (!isWorkoutVideo) {
    throw new AppError(404, "Workout video not found or already deleted.");
  }

  if (isWorkoutVideo && payload.video) {
    unlinkFile(isWorkoutVideo.video);
  }

  if (isWorkoutVideo && payload.image) {
    unlinkFile(isWorkoutVideo.image);
  }

  const updatedWorkout = await WorkoutVideo.findByIdAndUpdate(id, payload, {
    new: true,
  }).exec();

  if (!updatedWorkout) {
    if (payload.image) unlinkFile(payload.image);
    if (payload.video) unlinkFile(payload.video);
    throw new AppError(404, "Workout video not found or already deleted.");
  }

  return updatedWorkout;
};

const deleteWorkoutVideo = async (id: string) => {
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
