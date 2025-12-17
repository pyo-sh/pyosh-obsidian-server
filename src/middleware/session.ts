import session from "express-session";
import path from "path";
import SessionFileStore from "session-file-store";
import { env } from "@util/env";

declare module "express-session" {
  interface SessionData {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    ip: string | undefined;
  }
}

const FileStore = SessionFileStore(session);

export const SESSION_NAME = "pyoshs";
export const sessionMiddleware = session({
  store: new FileStore({
    path: path.join(__dirname, "../../sessions"),
    ttl: 60 * 60, // 1 hour
    retries: 2,
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  name: SESSION_NAME,
});
