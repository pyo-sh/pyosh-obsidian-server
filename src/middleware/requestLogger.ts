import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import pinoHttp from "pino-http";
import { env } from "@util/env";

const logger = pino<string>({
  level: env.isProd ? "info" : "debug",
  transport: env.isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
  base: {
    environment: env.NODE_ENV,
  },
});

const getLogLevel = (status: number): string => {
  if (status >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
  if (status >= StatusCodes.BAD_REQUEST) return "warn";

  return "info";
};

const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.id = (req.headers["x-request-id"] as string) || randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
};

const captureResponseBodyMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env.isProd) return next();

  const originalSend = res.send;
  res.send = function (body) {
    res.locals.responseBody = body;

    return originalSend.call(this, body);
  };

  next();
};

const httpLogger = pinoHttp({
  logger,
  genReqId: (req: Request) => req.id as string, // req.id로 통일
  customLogLevel: (req, res) => getLogLevel(res.statusCode),
  customSuccessMessage: (req) => `${req.method} ${req.url} - completed`,
  customErrorMessage: (req, res) =>
    `${req.method} ${req.url} - failed (${res.statusCode})`,
  serializers: {
    req: (req: Request) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    }),
    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },
});

const requestLogger = [
  requestIdMiddleware,
  captureResponseBodyMiddleware,
  httpLogger,
];
export default requestLogger;
