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
import { Users } from '../user/user.model';
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

    // Call service logic
    const { userToken } = await AuthService.googleCallback(code);

    // Set token cookie
    setAuthCookie(res, userToken);

    // Redirect to frontend
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }),
};

if (!userRes.ok) {
  throw new AppError(400, "Failed to fetch user info from Google");
}


const googleUser = await userRes.json();

let isUserExist = await Users.findOne({email:googleUser.email})


if(!isUserExist){
isUserExist = await Users.create({
  email:googleUser.email,
  name:googleUser.name,
  picture:googleUser.picture,
  auths:[{
    provider:"google",
    providerId:googleUser.id
  }],
})
}

if(!isUserExist){
  throw new AppError(404,"User not found")
}

if(isUserExist.status=== Status.isBlocked){
  throw new AppError(401,"User is blocked")
}

if(isUserExist.status=== Status.isInactive){
  throw new AppError(401,"User is inactive")
}

if(isUserExist.isDeleted){
  throw new AppError(401,"User is deleted")
}


const userToken = createUserToken(isUserExist)
setAuthCookie(res,userToken)


res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

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
