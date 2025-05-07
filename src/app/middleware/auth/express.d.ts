import { JwtPayload } from "jsonwebtoken";
import { IAuthData } from "./auth.interface";

declare global {
  namespace Express {
    interface Request {
      user: IAuthData; // Add 'user' property, assuming it's an IUser object
    }
  }
}
