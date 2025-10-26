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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const userToken_1 = require("../../utils/userToken");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendMail_1 = require("../../utils/sendMail");
const loginWithCredentials = (authInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = authInfo;
    const isUserExist = yield user_model_1.Users.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(401, "User not found");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(401, "Invalid password");
    }
    const userToken = (0, userToken_1.createUserToken)(isUserExist);
    //securityr jonnu password front end na dekhanor system
    const _a = isUserExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
const googleAuth = (redirect) => __awaiter(void 0, void 0, void 0, function* () {
    const scope = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");
    const params = new URLSearchParams({
        client_id: env_1.envVars.GOOGLE_CLIENT_ID,
        redirect_uri: env_1.envVars.GOOGLE_CALLBACK_URL,
        response_type: "code",
        scope,
        access_type: "offline",
        prompt: "consent",
        state: redirect,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.Users.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(400, "Old password is incorrect");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.Users.findOne({ email: email });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExist.status === user_interface_1.Status.isBlocked) {
        throw new AppError_1.default(400, "User is Blocked");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(400, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password=${isUserExist._id}/&token=${resetToken}`;
    (0, sendMail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Reset Password",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    });
});
exports.AuthService = {
    loginWithCredentials,
    getNewAccessToken,
    googleAuth,
    changePassword,
    forgotPassword
};
