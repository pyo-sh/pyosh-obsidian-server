import express, { Express } from "express";
import path from "path";
import { apiRouter } from "@src/api";
import {
  frontMiddleware,
  frontRouter,
  viewRouter,
} from "@src/middleware/front";
import { helmetMiddleware } from "@src/middleware/helmet";
import rateLimiterMiddleware from "@src/middleware/rateLimiter";
import { sessionMiddleware } from "@src/middleware/session";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetMiddleware);
app.use(rateLimiterMiddleware);
app.use(sessionMiddleware);

// Static Route
app.use("/", express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/api", apiRouter);

// Frontend Routes
// In Dev: Front Vite middleware
const viewPaths = ["/", "/privacy-policy"];
if (process.env.NODE_ENV === "development") {
  app.use(viewPaths, frontRouter);
  app.use("/", frontMiddleware);
} else {
  app.use(viewPaths, viewRouter);
}

export { app };
