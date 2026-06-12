import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!appId) {
    return NextResponse.json(
      { error: "Instagram OAuth not configured. Add INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET to .env.local" },
      { status: 503 }
    );
  }

  const redirectUri = encodeURIComponent(`${appUrl}/api/auth/instagram/callback`);
  const scope = encodeURIComponent("instagram_basic,instagram_content_publish");

  const authUrl =
    `https://api.instagram.com/oauth/authorize` +
    `?client_id=${appId}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&response_type=code`;

  return NextResponse.redirect(authUrl);
}
