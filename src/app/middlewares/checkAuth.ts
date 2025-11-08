/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Users } from "../modules/user/user.model";
import { verifiedToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Status } from "../modules/user/user.interface";
import AppError from "../errorHelper/AppError";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError(401, "Access token not found");
      }

      const verifyToken = verifiedToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await Users.findOne({ email: verifyToken.email });

      if (!isUserExist) {
        throw new AppError(401, "User not found");
      }

      if (isUserExist.status === Status.isBlocked) {
        throw new AppError(401, "User is blocked");
      }

      if (isUserExist.status === Status.isInactive) {
        throw new AppError(401, "User is inactive");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(401, "User is deleted");
      }

      if (!authRoles.includes(verifyToken.role)) {
        throw new AppError(401, "You are not authorized");
      }

      req.user = verifyToken;

      next();
    } catch (error: any) {
      console.log(error.message);
      next(error);
    }
  };
