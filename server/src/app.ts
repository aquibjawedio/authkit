import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.route.js";
import { authRouter } from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { userRouter } from "./routes/user.route.js";
import "./config/passport.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.set("trust proxy", true);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Defining all routes here
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Error Middleware
app.use(errorHandler);

export { app };
