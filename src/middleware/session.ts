import session from "express-session";
import MongoStore from "connect-mongo";
import { env } from "@util/env";

declare module "express-session" {
  interface SessionData {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    ip: string | undefined;
  }
}
const MAINTAIN_TIME = 30 * 60; // 30 minutes
export const SESSION_NAME = "pyosh.sid";
export const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    collectionName: env.MONGODB_COLLECTION_NAME,
    ttl: MAINTAIN_TIME,
    autoRemove: "native",
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: MAINTAIN_TIME * 1000,
  },
  name: SESSION_NAME,
  proxy: true,
});
