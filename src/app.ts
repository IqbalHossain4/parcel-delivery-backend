import express from "express";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Parcel Delivery Backend" });
});

app.set("trust proxy", true)

app.use(globalErrorHandler);

export default app;
