import { Router } from "express"
import { ParcelController } from "./parcel.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"


const route = Router()

// sender routes
route.post("/", checkAuth(Role.sender), ParcelController.createParcel)

route.get("/me", checkAuth(Role.sender), ParcelController.getSenderParcels)

route.patch("/cancel/:id", checkAuth(Role.sender), ParcelController.cancelParcel)


// receiver routes

route.get("/incoming", checkAuth(Role.receiver), ParcelController.getReceiverParcels)
route.patch("/confirm-delivery/:id", checkAuth(Role.receiver), ParcelController.confirmDelivery)



// admin routes
route.get("/all-parcels", checkAuth(Role.admin), ParcelController.getAllParcels)
route.patch("/status/:id", checkAuth(Role.admin), ParcelController.updateStatus)
route.patch("/block/:id", checkAuth(Role.admin), ParcelController.blockParcel)
route.patch("/assign/:id", checkAuth(Role.admin), ParcelController.assignParcel)


//tracking
route.get("/track/:trackingId", ParcelController.trackParcel)


export const ParcelRoute = route