import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/future-me-prompt";
import { chat, mockFutureMe } from "@/lib/ai/provider";
import type { AIMessage } from "@/lib/ai/provider";
import { retrieveContext } from "@/lib/rag/retriever";
import { semanticRetrieve } from "@/lib/rag/semantic-retriever";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // Retrieve relevant career context based on the latest user message
    const lastUserMessage = [...messages].reverse().find((m: AIMessage) => m.role === "user");
    const query = lastUserMessage?.content || "";

    // Try semantic RAG first; fall back to keyword retrieval if it fails
    let retrievedContext = "";
    try {
      const semantic = await semanticRetrieve(query, profile, 3);
      retrievedContext = semantic.formatted;
    } catch {
      const { formatted } = retrieveContext(query, profile, 3);
      retrievedContext = formatted;
    }

    const systemPrompt = buildSystemPrompt(profile, retrievedContext);

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
