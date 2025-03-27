export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  video: string;
  points: number;
  description: string;
  image: string;
  goal: string;
  duration: number;
  about: string;
  isDeleted: boolean;
  videoId: string;
  isPremium: boolean;
}

// !  need to make premium based on payment subcription
