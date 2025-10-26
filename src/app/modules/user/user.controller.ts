
/* eslint-disable @typescript-eslint/no-unused-vars */
//create User

import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    const result = await UserService.createUser(user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User created successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {

  const result = await UserService.getAllUsers(req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = await UserService.getMyProfile(decodedToken.userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserService.getUserById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const verifyToken = req.user as JwtPayload;
  const result = await UserService.updateUser(id, payload, verifyToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUser,
};
