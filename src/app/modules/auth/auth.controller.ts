import { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';
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


const googleCallback =  catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const code = req.query.code as string;
let redirectTo = req.query.state ? (req.query.state as string):"";
if(redirectTo.startsWith("/")){
  redirectTo = redirectTo.slice(1)
}
const tokenRes = await fetch("https://oauth2.googleapis.com/token",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
    code,
    client_id:envVars.GOOGLE_CLIENT_ID,
    client_secret:envVars.GOOGLE_CLIENT_SECRET,
    redirect_uri:envVars.GOOGLE_CALLBACK_URL,
    grant_type:"authorization_code"
  })
})

   if (!tokenRes.ok) {
  throw new AppError(400, "Failed to exchange code for token");
}

const {access_token } = await tokenRes.json();
const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{
  headers: { Authorization: `Bearer ${access_token}`}
})

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

export const AuthController = {
  loginWithCredentials,
  getNewAccessToken,
  logout,
  googleAuth,
  googleCallback
};
