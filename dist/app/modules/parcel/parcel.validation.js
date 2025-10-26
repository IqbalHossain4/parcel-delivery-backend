"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdSchema = zod_1.default.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid Object Id"
});
exports.createParcelZodSchema = zod_1.default.object({
    type: zod_1.default
        .string()
        .min(2, { message: "Type must be at least 2 characters long" })
        .max(50, { message: "Type must be at most 50 characters long" }),
    weight: zod_1.default.number().optional(),
    fee: zod_1.default.number().optional(),
    receiver: zod_1.default.object({
        name: zod_1.default.string(),
        address: zod_1.default.string(),
        email: zod_1.default.string().email().optional(),
        phone: zod_1.default.string(),
        city: zod_1.default.string().optional(),
        postalCode: zod_1.default.string(),
    }),
    deliveryDate: zod_1.default.preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date()),
    status: zod_1.default.enum(Object.values(parcel_interface_1.IParcelStatus)).optional(),
    trackingCode: zod_1.default.string().optional(),
    isFlagged: zod_1.default.boolean().default(false),
    isBlocked: zod_1.default.boolean().default(false),
    dispatchedAt: zod_1.default.preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional()),
    deliveredAt: zod_1.default.preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional()),
    statusLog: zod_1.default
        .array(zod_1.default.object({
        status: zod_1.default.string(),
        updatedBy: zod_1.default.string(),
        note: zod_1.default.string().optional(),
    }))
        .optional(),
});
exports.updateParcelZodSchema = zod_1.default.object({
    type: zod_1.default.string().optional(),
    weight: zod_1.default.number().optional(),
    fee: zod_1.default.number().optional(),
    receiver: zod_1.default
        .object({
        name: zod_1.default.string().optional(),
        address: zod_1.default.string().optional(),
        email: zod_1.default.string().email().optional(),
        phone: zod_1.default.string().optional(),
        city: zod_1.default.string().optional(),
        postalCode: zod_1.default.string().optional(),
    })
        .optional(),
    deliveryDate: zod_1.default
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional())
        .optional(),
    status: zod_1.default.enum(Object.values(parcel_interface_1.IParcelStatus)).optional(),
    trackingCode: zod_1.default.string().optional(),
    statusLog: zod_1.default
        .array(zod_1.default.object({
        status: zod_1.default.string().optional(),
        updatedBy: zod_1.default.string().optional(),
        note: zod_1.default.string().optional(),
    }))
        .optional(),
    assignedTo: objectIdSchema.optional(),
    isFlagged: zod_1.default.boolean().optional(),
    isBlocked: zod_1.default.boolean().optional(),
    dispatchedAt: zod_1.default
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional())
        .optional(),
    deliveredAt: zod_1.default
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional())
        .optional(),
    createdAt: zod_1.default
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional())
        .optional(),
    updatedAt: zod_1.default
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional())
        .optional(),
});
