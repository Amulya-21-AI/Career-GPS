import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { runAgent, type AgentMessage } from "@/lib/agent/orchestrator";
import type { UserProfile } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function getOrCreateSessionId(cookieStore: Awaited<ReturnType<typeof cookies>>): string {
  const existing = cookieStore.get("fg_session")?.value;
  if (existing) return existing;
  return randomUUID();
}

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = (await req.json()) as {
      messages: AgentMessage[];
      profile?: Partial<UserProfile>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = getOrCreateSessionId(cookieStore);

    const reply = await runAgent(messages, profile, sessionId);

    const res = NextResponse.json({ reply, sessionId });
    // Ensure cookie is set if new
    res.cookies.set("fg_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    console.error("Agent API error:", err);
    return NextResponse.json({ error: "Agent failed" }, { status: 500 });
  }
}
