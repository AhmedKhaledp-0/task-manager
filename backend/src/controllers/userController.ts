import { RegularMiddleware } from "../types/expressMiddleware";
import { IUser } from "../types/schemas";
import * as service from "../services/userService";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

export const getUserGet: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id)
      throw new Error("user credentials are not existed in the request!");

    const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

    const user: Partial<IUser> | undefined = await service.getUserById(id);

    res.status(200).json({ user: user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};
