import "server-only";
import { getTokens } from "../token-store";

const IG_GRAPH = "https://graph.instagram.com";

export async function getInstagramPosts(sessionId: string): Promise<string> {
  const tokens = getTokens(sessionId);
  if (!tokens.instagramAccessToken) {
    return "Instagram not connected. Ask the user to connect at /connect.";
  }

  try {
    // Fetch profile
    const profileRes = await fetch(
      `${IG_GRAPH}/me?fields=id,username,account_type,media_count&access_token=${tokens.instagramAccessToken}`
    );
    const profile = await profileRes.json();

    if (profile.error) {
      return `Instagram error: ${profile.error.message}`;
    }

    // Fetch recent media
    const mediaRes = await fetch(
      `${IG_GRAPH}/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count&limit=10&access_token=${tokens.instagramAccessToken}`
    );
    const media = await mediaRes.json();

    const posts = (media.data ?? []) as Array<{
      caption?: string;
      media_type?: string;
      timestamp?: string;
      like_count?: number;
      comments_count?: number;
    }>;

    const postLines = posts.map((p) => {
      const caption = (p.caption ?? "").slice(0, 200).replace(/\n/g, " ");
      return `• [${p.media_type}] ${caption || "(no caption)"} — ❤️ ${p.like_count ?? 0} 💬 ${p.comments_count ?? 0} on ${p.timestamp?.slice(0, 10) ?? ""}`;
    });

    return `INSTAGRAM PROFILE:
Username: @${profile.username ?? tokens.instagramUsername}
Account type: ${profile.account_type ?? "personal"}
Total posts: ${profile.media_count ?? "unknown"}

RECENT POSTS (${postLines.length}):
${postLines.join("\n") || "No posts found."}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Instagram error: ${msg}`;
  }
}
