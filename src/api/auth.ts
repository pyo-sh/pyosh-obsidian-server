import { Router } from "express";
import { env } from "@util/env";

const authRouter = Router();

authRouter.get("/google", (req, res) => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid",
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`${googleAuthUrl}?${params.toString()}`);
});

authRouter.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/?message=no_code");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);

      return res.redirect("/?message=token_exchange_failed");
    }

    req.session.accessToken = tokenData.access_token;
    req.session.refreshToken = tokenData.refresh_token;
    req.session.ip = req.ip;

    res.redirect(`/dashboard`);
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect("/?message=server_error");
  }
});

export { authRouter };
