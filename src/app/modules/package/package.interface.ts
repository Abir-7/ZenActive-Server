import { number } from "zod";

export type IPackage = {
  name: string | any;
  features: string[];
  unitAmount: number;
  interval: TInterval;
  productId: string;
  priceId: string;
  price: number;
};

export const interval = ["day", "week", "month", "half-year", "year"] as const;

export type TInterval = (typeof interval)[number];
