import { JwtPayload } from 'jsonwebtoken';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from '../../utils/userToken';
import { envVars } from '../../config/env';
import { Status } from '../user/user.interface';

const loginWithCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.loginWithCredentials(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User login successfully",
      data: {
        user: loginInfo.user,
        accessToken: loginInfo.accessToken,
        refreshToken: loginInfo.refreshToken,
      },
    });
  }
);


const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(401, "Refresh token not found");
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "New User Token created successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logout successfully",
      data: null,
    });
  }
);

const googleAuth = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const redirect = req.query.redirect as string || "/";
const result = await AuthService.googleAuth(redirect);
res.redirect(result);
})


const googleCallback =  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code as string;
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    
    const { userToken } = await AuthService.googleCallback(code);

  
    setAuthCookie(res, userToken);

   
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  })

const changePassword = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const newPassword =  req.body.newPassword;
const oldPassword = req.body.oldPassword;
const decodedToken = req.user as JwtPayload;
const result = await AuthService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)
sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Password changed successfully",
  data: result,
});
})


const forgotPassword = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const {email}= req.body;
await AuthService.forgotPassword(email);
sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Password reset link sent successfully",
  data: null,
});
})


export const AuthController = {
  loginWithCredentials,
  getNewAccessToken,
  logout,
  googleAuth,
  googleCallback,
  changePassword,
  forgotPassword
};
