import { Types } from "mongoose";

export interface IPayment {
  productId: string;
  purchaseId: string;
  expiryDate: Date;
  purchaseDate: Date;
  packageName: string;
  purchaseToken: string;
  packagePrice: number;
  userId: Types.ObjectId;
}
