import { Types } from "mongoose";

interface IWorkout {
  name: string;
  description?: string;
  exercises: Types.ObjectId[];
  points: number;
  image: string;
  isDeleted: boolean;
}

export default IWorkout;
