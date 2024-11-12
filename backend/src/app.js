//packages import
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
// default middlewares configurations
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "28kb" }));
app.use(express.urlencoded({ extended: true, limit: "28kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to SplitTrans");
});

import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import paymentsRouter from "./routes/payments.routes.js";
import categoryRouter from "./routes/category.routes.js";
//user routes

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/category", categoryRouter);
app.use("*", (req, res) => {
  res.status(404).json({
    message: `Either Requested Route ${req.originalUrl} does not exist or ${req.method} method is not allowed`,
    status: 404,
  });
});
//global error handler
app.use(globalErrorHandler);
export default app;
