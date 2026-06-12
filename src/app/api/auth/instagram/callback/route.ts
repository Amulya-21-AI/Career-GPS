import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { setInstagramTokens } from "@/lib/agent/token-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${appUrl}/connect?error=instagram_denied`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/instagram/callback`;

    // Exchange code for access token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      user_id?: number;
      error_message?: string;
    };

    if (!tokenData.access_token || !tokenData.user_id) {
      throw new Error(tokenData.error_message ?? "Token exchange failed");
    }

    // Get username
    const profileRes = await fetch(
      `https://graph.instagram.com/${tokenData.user_id}?fields=id,username&access_token=${tokenData.access_token}`
    );
    const profileData = (await profileRes.json()) as { username?: string };

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("fg_session")?.value;
    if (!sessionId) sessionId = randomUUID();

    setInstagramTokens(
      sessionId,
      tokenData.access_token,
      String(tokenData.user_id),
      profileData.username
    );

    const res = NextResponse.redirect(`${appUrl}/connect?success=instagram`);
    res.cookies.set("fg_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("Instagram callback error:", err);
    const appUrl2 = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl2}/connect?error=instagram_failed`);
  }
}
