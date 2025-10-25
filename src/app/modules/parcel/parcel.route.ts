import { Router } from "express"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"
import { validateRequest } from "../../middlewares/validateRequest"
import { createParcelZodSchema, updateParcelZodSchema } from "./parcel.validation"


const route = Router()

// sender routes
route.post("/", checkAuth(Role.sender), validateRequest(createParcelZodSchema), ParcelController.createParcel)
route.get("/me", checkAuth(Role.sender), ParcelController.getSenderParcels)
route.patch("/cancel/:id", checkAuth(Role.sender), validateRequest(updateParcelZodSchema), ParcelController.cancelParcel)


// receiver routes

route.get("/incoming", checkAuth(Role.receiver), ParcelController.getReceiverParcels)
route.patch("/confirm-delivery/:id", checkAuth(Role.receiver), validateRequest(updateParcelZodSchema), ParcelController.confirmDelivery)



// admin routes
route.get("/all-parcels", checkAuth(Role.admin), ParcelController.getAllParcels)
route.get("/:id", checkAuth(Role.admin), ParcelController.getParcelById)
route.patch("/status/:id", checkAuth(Role.admin),validateRequest(updateParcelZodSchema), ParcelController.updateStatus)
route.patch("/block/:id", checkAuth(Role.admin),validateRequest(updateParcelZodSchema), ParcelController.blockParcel)
route.patch("/assign/:id", checkAuth(Role.admin),validateRequest(updateParcelZodSchema), ParcelController.assignParcel)


//tracking
route.get("/track/:trackingId", ParcelController.trackParcel)


export const ParcelRoute = route