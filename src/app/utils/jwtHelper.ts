import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (payload: object, secret: Secret, expiresIn: any) => {
  return jwt.sign(payload as Object, secret as Secret, {
    expiresIn,
  });
};
const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = { generateToken, verifyToken };
