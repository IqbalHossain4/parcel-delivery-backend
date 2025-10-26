"use strict";
// ======== User Create Schema ========
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createuserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createuserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        error: (issue) => issue.input === undefined
            ? "Name is required"
            : "Name is must be string",
    })
        .min(2, { error: "Name must be at least 2 characters long" })
        .max(50, { error: "Name must be at most 50 characters long" }),
    email: zod_1.default
        .string({
        error: (issue) => issue === undefined ? "Email is required" : "Email is must be string",
    })
        .email({ error: "Email is invalid" })
        .min(5, { error: "Email must be at least 2 characters long" })
        .max(100, { error: "Email must be at most 50 characters long" }),
    password: zod_1.default
        .string({
        error: (issue) => issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
    })
        .min(8, { error: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
    }),
    phone: zod_1.default
        .string({
        error: (issue) => issue === undefined ? "Phone is required" : "Phone is must be string",
    })
        .min(11, { error: "Phone must be at least 8 characters long" })
        .max(50, { error: "Phone must be at most 50 characters long" })
        .optional(),
    address: zod_1.default
        .string({
        error: (issue) => issue === undefined
            ? "Address is required"
            : "Address is must be string",
    })
        .min(8, { error: "Address must be at least 8 characters long" })
        .max(50, { error: "Address must be at most 50 characters long" })
        .optional(),
});
// ======== User update Schema ========
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        error: (issue) => issue.input === undefined
            ? "Name is required"
            : "Name is must be string",
    })
        .min(2, { error: "Name must be at least 2 characters long" })
        .max(50, { error: "Name must be at most 50 characters long" })
        .optional(),
    phone: zod_1.default
        .string({
        error: () => "Phone Number must be a string",
    })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    status: zod_1.default.enum(Object.values(user_interface_1.Status)).optional(),
    isDeleted: zod_1.default
        .boolean({
        error: () => "isDeleted must be a boolean",
    })
        .optional(),
    isVerified: zod_1.default
        .boolean({
        error: () => "isVerified must be a boolean",
    })
        .optional(),
    address: zod_1.default
        .string({
        error: (issue) => issue === undefined
            ? "Address is required"
            : "Address is must be string",
    })
        .optional(),
});
