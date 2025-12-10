import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { env } from "@util/env";

const rateLimiterMiddleware = rateLimit({
  windowMs: 1000 * env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  legacyHeaders: true,
  standardHeaders: true,
  message: "Too many requests, please try again later.",
  keyGenerator: (req) => {
    // Refs: https://express-rate-limit.mintlify.app/reference/error-codes#err-erl-key-gen-ipv6
    if (req.query.apiKey) return req.query.apiKey as string;

    return ipKeyGenerator(req.ip as string);
  },
});

export default rateLimiterMiddleware;
