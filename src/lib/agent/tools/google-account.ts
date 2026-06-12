import "server-only";
import { google } from "googleapis";
import { getTokens } from "../token-store";

function getOAuth2Client(accessToken: string, refreshToken?: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  return client;
}

export async function getGoogleProfile(sessionId: string): Promise<string> {
  const tokens = getTokens(sessionId);
  if (!tokens.googleAccessToken) {
    return "Google account not connected. Ask the user to connect at /connect.";
  }

  try {
    const auth = getOAuth2Client(tokens.googleAccessToken, tokens.googleRefreshToken);
    const people = google.people({ version: "v1", auth });
    const res = await people.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses,occupations,interests,skills,educations,organizations",
    });

    const person = res.data;
    const name = person.names?.[0]?.displayName ?? "Unknown";
    const email = person.emailAddresses?.[0]?.value ?? "Unknown";
    const occupations = person.occupations?.map((o) => o.value).join(", ") ?? "None listed";
    const interests = person.interests?.map((i) => i.value).join(", ") ?? "None listed";
    // Note: 'educations' requires the 'educations' personField — may not always be returned
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personAny = person as any;
    const educations = (personAny.educations as Array<{ formattedType?: string; institution?: string }> | undefined)
      ?.map((e) => `${e.formattedType ?? ""}: ${e.institution ?? ""}`)
      .join(", ") ?? "None listed";
    const orgs = person.organizations
      ?.map((o) => `${o.name ?? ""} (${o.title ?? ""})`)
      .join(", ") ?? "None listed";

    return `GOOGLE PROFILE:
Name: ${name}
Email: ${email}
Organizations/Employment: ${orgs}
Education: ${educations}
Occupations: ${occupations}
Interests: ${interests}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Google profile error: ${msg}`;
  }
}

export async function getCalendarEvents(sessionId: string, days = 7): Promise<string> {
  const tokens = getTokens(sessionId);
  if (!tokens.googleAccessToken) {
    return "Google Calendar not connected.";
  }

  try {
    const auth = getOAuth2Client(tokens.googleAccessToken, tokens.googleRefreshToken);
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: future.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items ?? [];
    if (events.length === 0) return `No calendar events in the next ${days} days.`;

    const lines = events.map((e) => {
      const start = e.start?.dateTime ?? e.start?.date ?? "unknown";
      return `• ${e.summary ?? "Untitled"} @ ${start}`;
    });

    return `UPCOMING CALENDAR EVENTS (next ${days} days):\n${lines.join("\n")}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Calendar error: ${msg}`;
  }
}
