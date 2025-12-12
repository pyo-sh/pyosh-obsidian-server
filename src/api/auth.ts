import { Router } from "express";
import { env } from "@util/env";

const authRouter = Router();

// Google OAuth 시작
authRouter.get("/google", (req, res) => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`${googleAuthUrl}?${params.toString()}`);
});

// Google OAuth 콜백
authRouter.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/?error=no_code");
  }

  try {
    // 토큰 교환
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

      return res.redirect("/?error=token_exchange_failed");
    }

    // 사용자 정보 가져오기
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const userInfo = await userInfoResponse.json();

    // 토큰 정보를 쿼리 파라미터로 전달 (실제 프로덕션에서는 세션 사용 권장)
    const params = new URLSearchParams({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || "",
      email: userInfo.email,
      name: userInfo.name,
    });

    res.redirect(`/success?${params.toString()}`);
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect("/?error=server_error");
  }
});

export { authRouter };
