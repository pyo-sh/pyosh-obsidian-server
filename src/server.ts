import express, { Express } from "express";
import helmet from "helmet";
import rateLimiterMiddleware from "@src/middleware/rateLimiter";
import { helmetMiddleware } from "@src/middleware/helmet";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetMiddleware);
app.use(rateLimiterMiddleware);

// Routes

// Frontend route
app.use("/", express.static("public"));

export { app };
