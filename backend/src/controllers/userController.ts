import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { IUser } from "../types/schemas";
import * as service from "../services/userService";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";

export const getUserGet: RegularMiddlewareWithoutNext = async (req, res) => {
  const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

  const user: Partial<IUser> | undefined = await service.getUserById(id);

  if (!user) throw customError("fail", 404, "user is not found!");

  res.status(200).json({ user: user });
};

export const changePasswordPut: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

  const serviceResult = await service.changeUserPassword(
    id,
    data.oldPassword,
    data.newPassword
  );

  if (!serviceResult)
    throw customError("fail", 500, "failed to change password!");

  res.status(201).json({
    status: "success",
    message: "Your password's been changed successfully!",
  });
};

export const resetPasswordPut: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const serviceResult = await service.resetUserPassword(
    data.token,
    data.newPassword
  );

  if (!serviceResult)
    throw customError("fail", 500, "failed to reset your password!");

  res.status(201).json({
    status: "success",
    message: "Your password's been reset successfully!",
  });
};

export const deleteUserDelete: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

  const serviceResult = await service.deleteUserById(id);

  if (!serviceResult)
    throw customError("fail", 500, "failed to delete account!");

  res.status(204).json({
    status: "success",
    message: "your account's been deleted permanently!",
  });
};
