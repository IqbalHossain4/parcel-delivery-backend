"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoute = void 0;
const express_1 = require("express");
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parcel_validation_1 = require("./parcel.validation");
const route = (0, express_1.Router)();
// sender routes
route.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.sender), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelZodSchema), parcel_controller_1.ParcelController.createParcel);
route.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.sender), parcel_controller_1.ParcelController.getSenderParcels);
route.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.sender), parcel_controller_1.ParcelController.cancelParcel);
// receiver routes
route.get("/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.receiver), parcel_controller_1.ParcelController.getReceiverParcels);
route.patch("/confirm-delivery/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.receiver), parcel_controller_1.ParcelController.confirmDelivery);
// admin routes
route.get("/all-parcels", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), parcel_controller_1.ParcelController.getAllParcels);
route.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), parcel_controller_1.ParcelController.getParcelById);
route.patch("/status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateParcelZodSchema), parcel_controller_1.ParcelController.updateStatus);
route.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), parcel_controller_1.ParcelController.blockParcel);
route.patch("/assign/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateParcelZodSchema), parcel_controller_1.ParcelController.assignDeliveryPerson);
//tracking
route.get("/track/:trackingId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.receiver, user_interface_1.Role.sender), parcel_controller_1.ParcelController.trackParcel);
exports.ParcelRoute = route;
