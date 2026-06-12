import "server-only";
import { google } from "googleapis";
import { getTokens } from "../token-store";

function getOAuth2Client(accessToken: string, refreshToken?: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return client;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function decodeBase64(encoded: string): string {
  try {
    return Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

export async function readRecentEmails(
  sessionId: string,
  maxResults = 10,
  query = ""
): Promise<string> {
  const tokens = getTokens(sessionId);
  if (!tokens.googleAccessToken) {
    return "Gmail not connected. Ask the user to connect their Google account at /connect.";
  }

  try {
    const auth = getOAuth2Client(tokens.googleAccessToken, tokens.googleRefreshToken);
    const gmail = google.gmail({ version: "v1", auth });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      q: query || "is:inbox",
    });

    const messages = listRes.data.messages ?? [];
    if (messages.length === 0) return "No emails found.";

    const summaries: string[] = [];

    for (const msg of messages.slice(0, 10)) {
      if (!msg.id) continue;
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const headers = detail.data.payload?.headers ?? [];
      const subject = headers.find((h) => h.name === "Subject")?.value ?? "(no subject)";
      const from = headers.find((h) => h.name === "From")?.value ?? "unknown";
      const date = headers.find((h) => h.name === "Date")?.value ?? "";

      // Try to get body snippet
      const snippet = detail.data.snippet ?? "";
      const parts = detail.data.payload?.parts;
      let bodyText = snippet;

      if (parts) {
        const textPart = parts.find((p) => p.mimeType === "text/plain");
        if (textPart?.body?.data) {
          bodyText = decodeBase64(textPart.body.data).slice(0, 300);
        } else {
          const htmlPart = parts.find((p) => p.mimeType === "text/html");
          if (htmlPart?.body?.data) {
            bodyText = stripHtml(decodeBase64(htmlPart.body.data));
          }
        }
      }

      summaries.push(`FROM: ${from}\nDATE: ${date}\nSUBJECT: ${subject}\nSNIPPET: ${bodyText}`);
    }

    return `RECENT EMAILS (${summaries.length} messages):\n\n${summaries.join("\n---\n")}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Gmail error: ${msg}`;
  }
}
