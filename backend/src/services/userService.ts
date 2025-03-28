import { Types } from "mongoose";
import { IUser } from "../types/schemas";
import { User } from "../models/User";
import * as bcrypt from "../utils/bcryption";

export const getUserById = async (
  userId: Types.ObjectId
): Promise<Partial<IUser> | undefined> => {
  try {
    if (!userId) throw Error("service: user id's not provided");

    const user: Partial<IUser> | null = await User.findById({
      _id: userId,
    }).select(["firstName", "lastName", "email"]);

    if (!user) throw Error("service: user's not found");

    return user;
  } catch (error) {
    console.error(error);
  }
};

export const changeUserPassword = async (
  userId: Types.ObjectId,
  oldPassword: string,
  newPassword: string
): Promise<void | undefined> => {
  try {
    if (!userId || !oldPassword || !newPassword)
      throw new Error("either user id or old/new password is not provided");

    const userPassword: Partial<IUser> | null =
      await User.findById(userId).select("password");

    if (!(await bcrypt.verifyPassword(oldPassword, userPassword as string)))
      throw new Error("current password's incorrect!");

    const newHashedPassword: string = await bcrypt.hashPassword(newPassword);

    if (await bcrypt.verifyPassword(newPassword, userPassword as string))
      throw new Error("user password's already the same!");

    await User.updateOne({ password: newHashedPassword });
  } catch (error) {
    console.error(error);
  }
};
