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
exports.checkAuth = void 0;
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(401, "Access token not found");
        }
        const verifyToken = (0, jwt_1.verifiedToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.Users.findOne({ email: verifyToken.email });
        if (!isUserExist) {
            throw new AppError_1.default(401, "User not found");
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
        if (!authRoles.includes(verifyToken.role)) {
            throw new AppError_1.default(401, "You are not authorized");
        }
        req.user = verifyToken;
        next();
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.checkAuth = checkAuth;
