import express, { Express } from "express";
import path from "path";
import { apiRouter } from "@src/api";
import { frontMiddleware } from "@src/middleware/front";
import { helmetMiddleware } from "@src/middleware/helmet";
import rateLimiterMiddleware from "@src/middleware/rateLimiter";
import { viewRouter } from "@src/view";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetMiddleware);
app.use(rateLimiterMiddleware);

// Static Route
app.use("/", express.static(path.join(__dirname, "..", "public")));

// Frontend Routes
// 개발 모드에서 Front Vite 미들웨어 추가
if (process.env.NODE_ENV === "development") {
  app.use("/", frontMiddleware);
} else {
  app.use("/", viewRouter);
}

// Routes
app.use("/api", apiRouter);

export { app };
