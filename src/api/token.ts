import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import pino from "pino";
import { SESSION_NAME } from "@middleware/session";
import { env } from "@util/env";

const logger = pino({
  name: "token",
  level: "error",
});
const tokenRouter = Router();

const validateTokenSession: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken, refreshToken, ip } = req.session;

  // 세션 데이터 검증
  if (!accessToken || !refreshToken || !ip) {
    logger.error("Session validation error: No data in session");

    return res.status(400).json({ error: "no_data" });
  }

  // IP 검증
  if (ip !== req.ip) {
    logger.error("Session validation error: IP mismatch");

    return res.status(400).json({ error: "ip_mismatch" });
  }

  next();
};

tokenRouter.get("/", validateTokenSession, (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.session;

  return res.json({ accessToken, refreshToken });
});

tokenRouter.post(
  "/revoke",
  validateTokenSession,
  async (req: Request, res: Response): Promise<void> => {
    const { accessToken } = req.session;

    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Google revoke failed: ${response.status}`);
      }

      res.clearCookie(SESSION_NAME, {
        path: "/",
        httpOnly: true,
        secure: env.isProd,
        sameSite: "strict",
      });

      req.session.destroy((err) => {
        if (err) {
          logger.error("Session destroy error:", err);

          return res.redirect("/?message=server_error");
        }

        return res.redirect("/?message=revoked");
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error("Token revoke - unexpected error", error);

      return res.redirect("/?message=revoke_error");
    }
  },
);

export { tokenRouter };
