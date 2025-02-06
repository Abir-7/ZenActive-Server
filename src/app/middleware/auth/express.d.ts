import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthData; // Add 'user' property, assuming it's an IUser object
    }
  }
}
