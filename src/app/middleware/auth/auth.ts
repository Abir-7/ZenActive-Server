import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import httpCode from "http-status";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { IAuthData } from "./auth.interface";
import { TUserRole } from "../../modules/user/user.interface";
import { User } from "../../modules/user/user.model";

const auth =
  (...roles: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const tokenWithBearer = req?.headers?.authorization as string;

    // Check if the token exists and starts with "Bearer"
    if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
      return next(
        new AppError(httpCode.UNAUTHORIZED, "You are not authorized")
      );
    }

    const token = tokenWithBearer.split(" ")[1];

    // Check if token is "null"
    if (token === "null") {
      return next(
        new AppError(httpCode.UNAUTHORIZED, "You are not authorized")
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        config.security.jwt.secret as string
      ) as IAuthData;

      // Check if user exists in the database
      const findUser = await User.findOne({ email: decoded.userEmail });
      if (!findUser) {
        return next(
          new AppError(httpCode.UNAUTHORIZED, "You are not authorized")
        );
      }

      // Check if the user role is authorized
      if (roles.length && !roles.includes(decoded.userRole)) {
        return next(
          new AppError(httpCode.UNAUTHORIZED, "You are not authorized")
        );
      }

      // Attach decoded user info to request
      req.user = decoded;

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default auth;
