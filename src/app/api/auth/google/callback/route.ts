import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { google } from "googleapis";
import { setGoogleTokens } from "@/lib/agent/token-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${appUrl}/connect?error=google_denied`);
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${appUrl}/api/auth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email
    const peopleApi = google.people({ version: "v1", auth: oauth2Client });
    const profile = await peopleApi.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names",
    });
    const email = profile.data.emailAddresses?.[0]?.value;

    // Associate tokens with session
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("fg_session")?.value;
    if (!sessionId) {
      sessionId = randomUUID();
    }

    setGoogleTokens(sessionId, tokens.access_token!, tokens.refresh_token ?? undefined, email ?? undefined);

    const res = NextResponse.redirect(`${appUrl}/connect?success=google`);
    res.cookies.set("fg_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    const appUrl2 = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl2}/connect?error=google_failed`);
  }
}
