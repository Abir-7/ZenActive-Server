import { model, Schema } from "mongoose";
import {
  ActivityLevel,
  DietType,
  Gender,
  Injury,
  IUser,
  IUserModel,
  MedicalCondition,
  MovementDifficulty,
  PrimaryGoals,
  Restrictions,
} from "./user.interface";

import bcrypt from "bcryptjs";
import { config } from "../../config";
import { userRole } from "./user.constant";
export const userSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    role: {
      type: String,
      enum: userRole,
      default: "USER",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    name: {
      firstName: { type: String, required: false },
      lastName: { type: String, required: false },
    },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, enum: Object.values(Gender), required: false },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    primaryGoal: {
      type: String,
      enum: Object.values(PrimaryGoals),
      required: false,
    },
    diet: {
      type: String,
      enum: Object.values(DietType),
      required: false,
    },
    restriction: {
      type: String,
      enum: Object.values(Restrictions),
      required: false,
    },
    activityLevel: {
      type: String,
      enum: Object.values(ActivityLevel),
      required: false,
    },
    injury: {
      type: String,
      enum: Object.values(Injury),
      required: false,
    },
    movementDifficulty: {
      type: String,
      enum: Object.values(MovementDifficulty),
      required: false,
    },
    medicalCondition: {
      type: String,
      enum: Object.values(MedicalCondition),
      required: false,
    },

    occupation: { type: String, required: false },
    additionalDetails: { type: String, required: false },
    image: {
      type: String,
      default:
        "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg",
    },
    mobile: { type: String },

    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: false,
    },
    password: { type: String, required: true, select: false },
    isProfileUpdated: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    fcmToken: { type: String, unique: true },
    hasPremiumAccess: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password.trim(),
    Number(config.security.bcryptSaltRounds)
  );
  next();
});

userSchema.statics.passwordMatch = async function (
  hashedPass: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPass);
};

export const User = model<IUser, IUserModel>("User", userSchema);
