import { env } from "@util/env";
import type { Request } from "express";
import { rateLimit } from "express-rate-limit";

const rateLimiterMiddleware = rateLimit({
  windowMs: 1000 * env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  legacyHeaders: true,
  standardHeaders: true,
  message: "Too many requests, please try again later.",
  keyGenerator: (req: Request) => req.ip as string,
});

export default rateLimiterMiddleware;
