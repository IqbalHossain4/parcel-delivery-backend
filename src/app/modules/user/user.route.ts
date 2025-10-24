import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createuserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const route = Router();

route.post(
  "/register",
  validateRequest(createuserZodSchema),
  UserController.createUser
);

route.get("/allUser", UserController.getAllUsers);

route.get(
  "/me",
  checkAuth(...Object.values(Role)),
  UserController.getMyProfile
);

route.get("/:id", checkAuth(Role.admin), UserController.getUserById);

route.patch(
  "/:id",
  checkAuth(Role.admin),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

export const UserRoutes = route;
