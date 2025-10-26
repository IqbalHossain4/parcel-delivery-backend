"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const setCookie_1 = require("../../utils/setCookie");
const userToken_1 = require("../../utils/userToken");
const env_1 = require("../../config/env");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const loginWithCredentials = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthService.loginWithCredentials(req.body);
    (0, setCookie_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: {
            user: loginInfo.user,
            accessToken: loginInfo.accessToken,
            refreshToken: loginInfo.refreshToken,
        },
    });
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(401, "Refresh token not found");
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "New User Token created successfully",
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User logout successfully",
        data: null,
    });
}));
const googleAuth = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "/";
    const result = yield auth_service_1.AuthService.googleAuth(redirect);
    res.redirect(result);
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const tokenRes = yield fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            code,
            client_id: env_1.envVars.GOOGLE_CLIENT_ID,
            client_secret: env_1.envVars.GOOGLE_CLIENT_SECRET,
            redirect_uri: env_1.envVars.GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code"
        })
    });
    if (!tokenRes.ok) {
        throw new AppError_1.default(400, "Failed to exchange code for token");
    }
    const { access_token } = yield tokenRes.json();
    const userRes = yield fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    if (!userRes.ok) {
        throw new AppError_1.default(400, "Failed to fetch user info from Google");
    }
    const googleUser = yield userRes.json();
    let isUserExist = yield user_model_1.Users.findOne({ email: googleUser.email });
    if (!isUserExist) {
        isUserExist = yield user_model_1.Users.create({
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            auths: [{
                    provider: "google",
                    providerId: googleUser.id
                }],
        });
    }
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExist.status === user_interface_1.Status.isBlocked) {
        throw new AppError_1.default(401, "User is blocked");
    }
    if (isUserExist.status === user_interface_1.Status.isInactive) {
        throw new AppError_1.default(401, "User is inactive");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(401, "User is deleted");
    }
    const userToken = (0, userToken_1.createUserToken)(isUserExist);
    (0, setCookie_1.setAuthCookie)(res, userToken);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    const result = yield auth_service_1.AuthService.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Password reset link sent successfully",
        data: null,
    });
}));
exports.AuthController = {
    loginWithCredentials,
    getNewAccessToken,
    logout,
    googleAuth,
    googleCallback,
    changePassword,
    forgotPassword
};
