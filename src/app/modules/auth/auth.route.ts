import { Router } from "express";
import { AuthController } from "./auth.controller";

const route = Router();

route.post("/login", AuthController.loginWithCredentials);
route.post("/refresh-token", AuthController.getNewAccessToken);
route.post("/logout", AuthController.logout);
route.get("/google",  AuthController.googleAuth)
route.get("/google/callback", AuthController.googleCallback)

export const AuthRoutes = route;
