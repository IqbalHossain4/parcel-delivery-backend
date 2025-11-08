import { Router } from "express";
import { OTPController } from "./otp.controller";

const route = Router();

route.post("/send", OTPController.sendOTP);
route.post("/verify", OTPController.verifyOTP);

export const OTPRoutes = route;
