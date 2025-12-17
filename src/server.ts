import express, { Express } from "express";
import path from "path";
import { apiRouter } from "@api/index";
import { createViewMiddleware } from "@middleware/front";
import { helmetMiddleware } from "@middleware/helmet";
import rateLimiterMiddleware from "@middleware/rateLimiter";
import { sessionMiddleware } from "@middleware/session";

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
const viewPaths = ["/", "/privacy-policy", "/dashboard"];
const viewMiddleware = createViewMiddleware(viewPaths);

// In Dev: Front Vite middleware
if (viewMiddleware.viteMiddleware) {
  app.use("/", viewMiddleware.viteMiddleware);
}

app.use(viewMiddleware.paths, viewMiddleware.router);

export { app };
