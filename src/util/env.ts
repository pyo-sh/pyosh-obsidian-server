import dotenv from "dotenv";
import pino from "pino";
import z from "zod";

const logger = pino({
  name: "env",
  level: "error",
});

const getEnvPath = () => {
  const nodeEnv = process.env.NODE_ENV || "development";

  switch (nodeEnv) {
    case "production":
      return ".production.env";
    case "test":
      return ".test.env";
    case "development":
    default:
      return ".env";
  }
};

dotenv.config({
  path: getEnvPath(),
});

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  HOST: z.string().min(1).prefault("localhost"),
  PORT: z.coerce.number().int().positive().prefault(3000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  MONGODB_COLLECTION_NAME: z.string().min(1),
});

const getEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const error = z.flattenError(result.error);
    const errorMessage = `Invalid environment variables: ${error}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    ...result.data,
    isDev: result.data.NODE_ENV === "development",
    isProd: result.data.NODE_ENV === "production",
    isTest: result.data.NODE_ENV === "test",
  };
};

export const env = getEnv();
