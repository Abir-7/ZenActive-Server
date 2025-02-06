import mongoose from "mongoose";
import { interval, IPackage } from "./package.interface";

const planSchema = new mongoose.Schema<IPackage>({
  name: {
    type: String,
    required: true,
  },
  features: [
    {
      type: [String],
      required: true,
    },
  ],
  unitAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  interval: {
    type: String,
    enum: interval,
  },
  productId: {
    type: String,
  },
  priceId: {
    type: String,
  },
  price: {
    type: Number,
  },
});

export const Package = mongoose.model<IPackage>("Package", planSchema);
