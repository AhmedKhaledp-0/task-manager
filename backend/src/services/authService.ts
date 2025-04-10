import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/bcryption";
import { IUser } from "../types/schemas";
import { generateToken } from "../utils/token";
import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { resetPasswordEmail } from "../utils/mail";

export type RegisterUser = (data: IUser) => Promise<boolean | undefined>;

export const registerUser: RegisterUser = async (userData) => {
  try {
    const isExisted = await User.checkUserByEmail(userData.email);

    if (isExisted) throw new Error("user is already existed, try to login");

    const hashedPassword = await hashPassword(userData.password);

    const createdUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    if (createdUser) return true;
  } catch (error) {
    console.error(error);
  }
};

type LoginUser = (data: Partial<IUser>) => Promise<IUser | undefined>;

export const loginUser: LoginUser = async (userData) => {
  try {
    const user = await User.findOne({ email: userData.email });

    if (!user) throw new Error("User is not existed");

    const checkPassword = await verifyPassword(
      userData.password as string,
      user.password
    );

    if (!checkPassword) throw new Error("Password's not correct");

    return user;
  } catch (error) {
    console.error(error);
  }
};

export type ForgetPassword = (userEmail: string) => Promise<void>;

export const forgetPassword: ForgetPassword = async (userEmail) => {
  try {
    if (!userEmail) throw new Error("user email's not provided");

    const userId = await User.findOne({ email: userEmail }).select("_id");

    if (!userId) throw new Error("user's not existed!");

    const payload: JwtPayload = { id: userId };
    const secret = process.env.JWT_SECRET as Secret;
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: "5d",
    };

    const token = await generateToken(payload, secret, options);

    const domain: string = `${process.env.REDIRECT_DOMAIN}/user/resetpassword/${token}`;

    await resetPasswordEmail(
      process.env.EMAIL_SENDER as string,
      userEmail,
      domain
    );
  } catch (error) {
    console.error(error);
  }
};
