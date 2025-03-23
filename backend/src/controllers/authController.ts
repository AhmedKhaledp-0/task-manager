import * as authService from "../services/authService";
import { RegularMiddleware } from "../types/expressMiddleware";
import passport, { AuthenticateCallback } from "passport";
import { signToken } from "../middlewares/jwt";
import { IUser } from "../types/schemas";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";

export const signUp: RegularMiddleware = async (req, res, next) => {
  try {
    const data: IUser = req.body;

    const user = await authService.registerUser({ ...data });

    if (!user) throw new Error("regiseration failed");

    res.status(201).json({
      status: "success",
      message: "registered successfully!",
      user: { ...user },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: "fail", message: "failed to register" });

    next(error);
  }
};

export const loginLocal = [
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json({ status: "fail", message: "failed to login!" });
      }

      req.user = user as HydratedDocument<IUser>;

      next();
    } as AuthenticateCallback)(req, res, next);
  },
  signToken,
];

export const loginGoogle: RegularMiddleware[] = [
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
];

export const loginGoogleCB: RegularMiddleware[] = [
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  signToken,
];
