import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.route.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true }));

// Defining all routes here
app.use("/api/v1/health", healthRouter);

export { app };
