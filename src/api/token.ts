import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { SESSION_NAME } from "@middleware/session";

const tokenRouter = Router();

const validateTokenSession: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken, refreshToken, ip } = req.session;

  // 세션 데이터 검증
  if (!accessToken || !refreshToken || !ip) {
    console.error("Session validation error: No data in session");

    return res.status(400).json({ error: "no_data" });
  }

  // IP 검증
  if (ip !== req.ip) {
    console.error("Session validation error: IP mismatch");

    return res.status(400).json({ error: "ip_mismatch" });
  }

  next();
};

tokenRouter.get("/", validateTokenSession, (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.session;
  res.json({ accessToken, refreshToken });
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

      res.clearCookie(SESSION_NAME);
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);

          return res.redirect("/?message=server_error");
        }

        return res.redirect("/?message=revoked");
      });
    } catch (error) {
      console.error("Token revoke error:", error);

      return res.redirect("/?message=revoke_error");
    }
  },
);

export { tokenRouter };
