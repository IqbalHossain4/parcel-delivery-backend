import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const route = Router();

route.post("/login", AuthController.loginWithCredentials);
route.post("/refresh-token", AuthController.getNewAccessToken);
route.post("/logout", AuthController.logout);
route.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
route.post("/forgot-password", AuthController.forgotPassword)


route.get("/google",  AuthController.googleAuth)
route.get("/google/callback", AuthController.googleCallback)

export const AuthRoutes = route;
