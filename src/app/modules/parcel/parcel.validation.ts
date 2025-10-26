import z from "zod";
import { IParcelStatus } from "./parcel.interface";
import mongoose from "mongoose";


const objectIdSchema=  z.string().refine((val)=>mongoose.Types.ObjectId.isValid(val),{
    message:"Invalid Object Id"
})


export const createParcelZodSchema = z.object({
  type: z
    .string()
    .min(2, { message: "Type must be at least 2 characters long" })
    .max(50, { message: "Type must be at most 50 characters long" }),
  weight: z.number().optional(),
  fee: z.number().optional(),
  receiver: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string().email().optional(),
    phone: z.string(),
    city: z.string().optional(),
    postalCode: z.string(),
  }),
  
  deliveryDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date()
  ),

  status: z.enum(Object.values(IParcelStatus) as [string]).optional(),
  trackingCode: z.string().optional(),

  isFlagged: z.boolean().default(false),
  isBlocked: z.boolean().default(false),

  dispatchedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),

  deliveredAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),

  statusLog: z
    .array(
      z.object({
        status: z.string(),
        updatedBy: z.string(),
        note: z.string().optional(),
      })
    )
    .optional(),
});


export const updateParcelZodSchema =z.object({
  type: z.string().optional(),
  weight: z.number().optional(),
  fee: z.number().optional(),
  receiver: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),

  deliveryDate: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
  status: z.enum(Object.values(IParcelStatus) as [string]).optional(),
  trackingCode: z.string().optional(),
  statusLog: z
    .array(
      z.object({
        status: z.string().optional(),
        updatedBy: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
  assignedTo: objectIdSchema.optional(),
  isFlagged: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  dispatchedAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),

  deliveredAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
  createdAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
  updatedAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
});
