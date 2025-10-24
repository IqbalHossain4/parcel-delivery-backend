/* eslint-disable @typescript-eslint/no-unused-vars */
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { Users } from "../user/user.model";
import bcrypt from "bcryptjs";

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




export const AuthService = {
  loginWithCredentials,
  getNewAccessToken,
  googleAuth,
};
