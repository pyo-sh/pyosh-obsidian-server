import express, { Express } from "express";
import path from "path";
import pino from "pino";
import { apiRouter } from "@api/index";
import errorHandler from "@middleware/errorHandler";
import { createViewMiddleware } from "@middleware/front";
import { helmetMiddleware } from "@middleware/helmet";
import rateLimiterMiddleware from "@middleware/rateLimiter";
import requestLogger from "@middleware/requestLogger";
import { sessionMiddleware } from "@middleware/session";
import { env } from "@util/env";

const logger = pino({
  name: "server start",
  level: env.isProd ? "info" : "debug",
  transport: env.isProd ? undefined : { target: "pino-pretty" },
});
const app: Express = express();

// Trust Proxy for deployments
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetMiddleware);
app.use(rateLimiterMiddleware);
app.use(sessionMiddleware);

// Logging requests
app.use(requestLogger);

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

// Error handlers
app.use(errorHandler);

app.listen(env.PORT, env.HOST, () => {
  logger.info(
    `Server (${env.NODE_ENV}) running on port http://${env.HOST}:${env.PORT}`,
  );
});
