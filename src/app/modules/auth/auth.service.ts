import jwt  from 'jsonwebtoken';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser, Status } from "../user/user.interface";
import { Users } from "../user/user.model";
import bcrypt from "bcryptjs";
import { sendEmail } from '../../utils/sendMail';
import { name } from 'ejs';

const loginWithCredentials = async (authInfo: Partial<IUser>) => {
  const { email, password } = authInfo;

  const isUserExist = await Users.findOne({ email });
  if (!isUserExist) {
    throw new AppError(401, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid password");
  }

  const userToken = createUserToken(isUserExist);

  //securityr jonnu password front end na dekhanor system

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const googleAuth =async(redirect:string)=>{
const scope = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const params = new URLSearchParams({
    client_id:envVars.GOOGLE_CLIENT_ID,
    redirect_uri:envVars.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope,
    access_type: "offline",
    prompt: "consent",
    state: redirect,
  })

   return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

const googleCallback = async(code:string)=>{
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: envVars.GOOGLE_CLIENT_ID,
        client_secret: envVars.GOOGLE_CLIENT_SECRET,
        redirect_uri: envVars.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new AppError(400, "Failed to exchange code for token");
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      throw new AppError(400, "Failed to fetch user info from Google");
    }

    const googleUser = await userRes.json();

   
    let isUserExist = await Users.findOne({ email: googleUser.email });

    
    if (!isUserExist) {
      isUserExist = await Users.create({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        auths: [
          {
            provider: "google",
            providerId: googleUser.id,
          },
        ],
      });
    }
  
    if (!isUserExist) throw new AppError(404, "User not found");

    if (isUserExist.status === Status.isBlocked)
      throw new AppError(401, "User is blocked");

    if (isUserExist.status === Status.isInactive)
      throw new AppError(401, "User is inactive");

    if (isUserExist.isDeleted) throw new AppError(401, "User is deleted");


    const userToken = createUserToken(isUserExist);

    return { userToken };
  }



const changePassword = async(oldPassword:string,newPassword:string,decodedToken:JwtPayload)=>{
  const user = await Users.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcrypt.compare(oldPassword,user?.password as string);

  if(!isOldPasswordMatch){
    throw new AppError(400,"Old password is incorrect")
  }
  user!.password = await bcrypt.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND));

  user!.save();
}


const forgotPassword = async(email:string)=>{
const isUserExist = await Users.findOne({email:email});

if(!isUserExist){
  throw new AppError(404,"User not found")
}

if(isUserExist.status === Status.isBlocked){
  throw new AppError(400,"User is Blocked")
}

if(isUserExist.isDeleted){
  throw new AppError(400,"User is deleted")
}

const jwtPayload = {
  userId:isUserExist._id,
  email:isUserExist.email,
  role:isUserExist.role,
}

const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET,{
  expiresIn:"10m"
})

const resetUILink = `${envVars.FRONTEND_URL}/reset-password=${isUserExist._id}/&token=${resetToken}`
sendEmail({
  to:isUserExist.email,
  subject:"Reset Password",
  templateName:"forgotPassword",
  templateData:{
    name:isUserExist.name,
    resetUILink
  }
})
}


export const AuthService = {
  loginWithCredentials,
  getNewAccessToken,
  googleAuth,
  changePassword,
  forgotPassword,
  googleCallback
};
