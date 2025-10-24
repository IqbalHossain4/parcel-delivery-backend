import z from "zod";



export const createParcelZodSchema = z.object({
    type:z.string()
    .min(2, { error: "Type must be at least 2 characters long" })
    .max(50, { error: "Type must be at most 50 characters long" }),
    weight:z.number().optional(),
    address:z.string(),
    fee:z.number().optional(),
    sender:z.string(),
    receiver:{
        name:z.string(),
        address:z.string(),
        phone:z.string(),
        city:z.string(),
        postalCode:z.string()
    },
    assignedTo:z.string().optional(),
    deliveryDate:z.date(),
    statusLog:z.array(z.object({
        status:z.string(),
        updatedBy:z.string(),
        note:z.string().optional()
    })).optional(),

})