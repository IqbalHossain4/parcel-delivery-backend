// ======== User Create Schema ========

import z from "zod";
import { Role, Status } from "./user.interface";

export const createuserZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name is must be string",
    })
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be at most 50 characters long" }),

  email: z
    .string({
      error: (issue) =>
        issue === undefined ? "Email is required" : "Email is must be string",
    })
    .email({ error: "Email is invalid" })
    .min(5, { error: "Email must be at least 2 characters long" })
    .max(100, { error: "Email must be at most 50 characters long" }),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
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
  phone: z
    .string({
      error: (issue) =>
        issue === undefined ? "Phone is required" : "Phone is must be string",
    })
    .min(11, { error: "Phone must be at least 8 characters long" })
    .max(50, { error: "Phone must be at most 50 characters long" })
    .optional(),

  address: z
    .string({
      error: (issue) =>
        issue === undefined
          ? "Address is required"
          : "Address is must be string",
    })
    .min(8, { error: "Address must be at least 8 characters long" })
    .max(50, { error: "Address must be at most 50 characters long" })
    .optional(),
});

// ======== User update Schema ========

export const updateUserZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name is must be string",
    })
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be at most 50 characters long" })
    .optional(),
  phone: z
    .string({
      error: () => "Phone Number must be a string",
    })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      error:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),

  status: z.enum(Object.values(Status) as [string]).optional(),
  isDeleted: z
    .boolean({
      error: () => "isDeleted must be a boolean",
    })
    .optional(),
  isVerified: z
    .boolean({
      error: () => "isVerified must be a boolean",
    })
    .optional(),

  address: z
    .string({
      error: (issue) =>
        issue === undefined
          ? "Address is required"
          : "Address is must be string",
    })
    .optional(),
});
