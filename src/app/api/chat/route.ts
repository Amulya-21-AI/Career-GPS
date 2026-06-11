import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/future-me-prompt";
import { chat, mockFutureMe } from "@/lib/ai/provider";
import type { AIMessage } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(profile);

    // Use real AI if key present, mock otherwise
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_key_here") {
      const lastUser = messages.findLast((m: AIMessage) => m.role === "user");
      const reply = mockFutureMe(lastUser?.content || "");
      return NextResponse.json({ reply });
    }

    const reply = await chat(systemPrompt, messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
