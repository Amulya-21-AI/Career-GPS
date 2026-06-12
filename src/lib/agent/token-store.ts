import "server-only";
import fs from "fs";
import path from "path";

// File-based token store — survives dev server HMR restarts
// In production replace with a real database (Postgres, Redis, etc.)
const TOKEN_FILE = path.join(process.cwd(), ".tokens.json");

interface SessionTokens {
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleEmail?: string;
  instagramAccessToken?: string;
  instagramUserId?: string;
  instagramUsername?: string;
}

type TokenStore = Record<string, SessionTokens>;

function readStore(): TokenStore {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
    }
  } catch {
    // corrupt file — start fresh
  }
  return {};
}

function writeStore(store: TokenStore) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[token-store] Failed to write tokens:", err);
  }
}

export function getTokens(sessionId: string): SessionTokens {
  return readStore()[sessionId] ?? {};
}

export function setGoogleTokens(
  sessionId: string,
  accessToken: string,
  refreshToken?: string,
  email?: string
) {
  const store = readStore();
  store[sessionId] = {
    ...store[sessionId],
    googleAccessToken: accessToken,
    googleRefreshToken: refreshToken,
    googleEmail: email,
  };
  writeStore(store);
}

export function setInstagramTokens(
  sessionId: string,
  accessToken: string,
  userId: string,
  username?: string
) {
  const store = readStore();
  store[sessionId] = {
    ...store[sessionId],
    instagramAccessToken: accessToken,
    instagramUserId: userId,
    instagramUsername: username,
  };
  writeStore(store);
}

export function isGoogleConnected(sessionId: string): boolean {
  return !!readStore()[sessionId]?.googleAccessToken;
}

export function isInstagramConnected(sessionId: string): boolean {
  return !!readStore()[sessionId]?.instagramAccessToken;
}

export function clearSession(sessionId: string) {
  const store = readStore();
  delete store[sessionId];
  writeStore(store);
}
