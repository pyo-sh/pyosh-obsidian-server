import helmet from "helmet";
import { env } from "@util/env";

export const helmetMiddleware = helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...(env.isDev ? ["'unsafe-inline'"] : [])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", ...(env.isDev ? ["*"] : [])],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(env.isDev ? [`ws://${env.HOST}:*`] : [])],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
  },
});
