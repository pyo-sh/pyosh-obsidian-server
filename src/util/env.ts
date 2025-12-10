import dotenv from "dotenv";
import z from "zod";

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
});

const getEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const error = z.flattenError(result.error);
    const errorMessage = `Invalid environment variables: ${error}`;
    console.error("❌", errorMessage);
    throw new Error(errorMessage);
  }

  return { ...result.data };
};

export const env = getEnv();

console.log(env);
