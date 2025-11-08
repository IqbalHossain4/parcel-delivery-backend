import express from "express";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { envVars } from "./app/config/env";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Parcel Delivery Backend" });
});

app.set("trust proxy", true);

app.use(globalErrorHandler);

export default app;
