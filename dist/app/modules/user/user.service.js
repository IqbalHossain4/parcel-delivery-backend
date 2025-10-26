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
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.Users.findOne({ email });
    if (isUserExist) {
        throw new Error("User is Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.Users.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userSearchField = ["name", "email", "role"];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.Users.find(), query);
    const users = yield queryBuilder.search(userSearchField).paginate().fields().filter().sort();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.Users.findById(userId).select("-password");
    return result;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.Users.findById(id);
    return result;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role == user_interface_1.Role.receiver || decodedToken.role == user_interface_1.Role.sender) {
        if (userId != decodedToken.userId) {
            throw new AppError_1.default(401, "Unauthorized");
        }
    }
    const isUserExist = yield user_model_1.Users.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    if (decodedToken.role !== user_interface_1.Role.admin) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.receiver ||
            decodedToken.role === user_interface_1.Role.sender) {
            throw new AppError_1.default(401, "Unauthorized");
        }
    }
    if (payload.status || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.receiver ||
            decodedToken.role === user_interface_1.Role.sender) {
            throw new AppError_1.default(401, "Unauthorized");
        }
    }
    const newUpdateUser = yield user_model_1.Users.findByIdAndUpdate({ _id: userId }, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdateUser;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUser,
};
