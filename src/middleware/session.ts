import session from "express-session";
import path from "path";
import SessionFileStore from "session-file-store";
import { env } from "@util/env";

const FileStore = SessionFileStore(session);

export const sessionMiddleware = session({
  store: new FileStore({
    path: path.join(__dirname, "../../sessions"),
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  name: "pyoshs",
});
