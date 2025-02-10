import { Types } from "mongoose";

export interface ISubscription {
  productId: string;
  purchaseId: string;
  expiryData: string; // Assuming expiryDate is a string in a specific format
  purchaseDate: Date;
  packageName: string;
  purchaseToken: string;
  packagePrice: number;
  userId: Types.ObjectId;
}
