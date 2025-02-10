import { Model, Types } from "mongoose";
import User_Role from "./user.constant";

export type IUserRole = "USER" | "ADMIN";

export interface IUser {
  email: string;
  role: IUserRole;
  isVerified: boolean;

  name?: {
    firstName?: string;
    lastName?: string;
  };
  dateOfBirth?: Date;
  gender?: Gender;
  height?: number;
  weight?: number;
  primaryGoal?: PrimaryGoals;
  diet?: DietType;
  activityLevel?: ActivityLevel;
  injury?: Injury;
  movementDifficulty?: MovementDifficulty;
  medicalCondition?: MedicalCondition;
  occupation?: string;
  additionalDetails?: string;
  image: string;
  appData: Types.ObjectId;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  password: string;
  isProfileUpdated: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  mobile: string;
  fcmToken: string;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum PrimaryGoals {
  BuildMuscle = "Build Muscle",
  LoseWeight = "Lose Weight",
  ImproveEndurance = "Improve Endurance",
  IncreaseFlexibility = "Increase Flexibility",
  BoostEnergy = "Boost Energy",
  EnhanceMentalHealth = "Enhance Mental health",
  GainWeight = "Gain Weight",
}

export enum DietType {
  Vegan = "Vegan",
  Vegetarian = "Vegetarian",
  NoPreference = "No Preference",
  KetoLowCarb = "Keto/Low Carb",
  GlutenFree = "Gluten-Free",
}

export enum ActivityLevel {
  Sedentary = "Sedentary (little to no exercise)",
  LightlyActive = "Lightly Active (light exercise 1-3 days/week)",
  ModeratelyActive = "Moderately Active (exercise 3-5 days/week)",
  VeryActive = "Very Active (hard exercise 6-7 days/week)",
  SuperActive = "Super Active (intense exercise every day)",
}

export enum Injury {
  NoInjuries = "No Injuries",
  BackPain = "Back Pain",
  KneeIssues = "Knee Issues",
  ShoulderInjuries = "Shoulder Injuries",
  AnkleSprains = "Ankle Sprains",
}

export enum MovementDifficulty {
  NoDifficulty = "No Difficulty",
  OverheadMovements = "Overhead Movements",
  DeepSquats = "Deep Squats",
  RotationalMovements = "Rotational Movements",
  ForwardBends = "Forward Bends",
}

export enum MedicalCondition {
  NoMedicalConditions = "No Medical Conditions",
  Asthma = "Asthma",
  HeartConditions = "Heart Conditions",
  Diabetes = "Diabetes",
  Arthritis = "Arthritis",
}

export interface IUserModel extends Model<IUser> {
  passwordMatch(hashedPass: string, password: string): Promise<boolean>;
}
export type TUserRole = keyof typeof User_Role;

// user update interface

export interface IUpdateUser {
  medicalCondition: MedicalCondition;
  movementDifficulty: MovementDifficulty;
  injury: Injury;
  activityLevel: ActivityLevel;
  diet: DietType;
  primaryGoal: PrimaryGoals;
  weight: number;
  height: number;
  gender: Gender;
  dateOfBirth: Date;
  name: { firstName: string; lastName: string };
  image?: string;
}
