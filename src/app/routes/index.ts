import { path } from "path";
import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ParcelRoute } from "../modules/parcel/parcel.route";
import { OTPRoutes } from "../modules/otp/otp.routes";
export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/parcels",
    route: ParcelRoute,
  },
  {
    path: "/otp",
    route: OTPRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
