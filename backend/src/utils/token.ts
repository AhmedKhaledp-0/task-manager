import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

export const generateToken = async (payload: JwtPayload, secret: Secret) => {
  try {
    if (!payload || Object.keys(payload).length === 0 || !secret)
      throw new Error("invalid payload or secret");

    const token: string = sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "5m",
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (token: string, secret: Secret) => {
  try {
    if (!token || !secret) throw new Error("invalid token or secret");

    const validToken = verify(token, secret, (err, payload) => {
      if (err) return false;

      return payload;
    });

    return validToken;
  } catch (error) {
    console.error(error);
  }
};
