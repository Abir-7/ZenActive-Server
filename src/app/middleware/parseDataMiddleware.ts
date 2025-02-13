import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

export const parseField = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log(req.body, "parse field");

    try {
      if (req.body[fieldName]) {
        req.body = JSON.parse(req.body[fieldName]);
        console.log(req.body, "parse field");
        next();
      } else {
        next();
      }
    } catch (error) {
      throw new AppError(500, "Invalid JSON string");
    }
  };
};
