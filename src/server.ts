import express, { Express } from "express";
import path from "path";
import { apiRouter } from "@src/api";
import { helmetMiddleware } from "@src/middleware/helmet";
import rateLimiterMiddleware from "@src/middleware/rateLimiter";
import { webRouter } from "@src/web/router";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetMiddleware);
app.use(rateLimiterMiddleware);

// Static Route
app.use("/", express.static(path.join(__dirname, "..", "public")));

// Frontend Routes
app.use("/", webRouter);

// Routes
app.use("/api", apiRouter);

export { app };
