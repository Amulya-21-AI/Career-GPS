import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { UserProfile } from "@/types";
import { semanticRetrieve } from "@/lib/rag/semantic-retriever";
import { buildSystemPrompt } from "@/lib/ai/future-me-prompt";
import { readRecentEmails } from "./tools/gmail";
import { getGoogleProfile, getCalendarEvents } from "./tools/google-account";
import { getInstagramPosts } from "./tools/instagram";
import { isGoogleConnected, isInstagramConnected } from "./token-store";

const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "search_careers_semantic",
    description:
      "Search the career knowledge base using semantic similarity. Use when user asks about career options, skills needed, salary ranges, or timelines. Returns top matching careers with real data.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What to search for — e.g., 'machine learning engineer skills salary'",
        },
        topK: {
          type: "number",
          description: "Number of results (default 3, max 5)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "read_recent_emails",
    description:
      "Read user's recent Gmail messages. Use to understand their current job search, internship applications, or career-related activities. Only call if Google is connected.",
    input_schema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Number of emails to read (default 10, max 20)",
        },
        query: {
          type: "string",
          description: "Gmail search filter — e.g., 'internship application job offer'",
        },
      },
      required: [],
    },
  },
  {
    name: "get_google_profile",
    description:
      "Get user's Google account profile: name, email, education, work history. Only call if Google is connected.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_calendar_events",
    description:
      "Get user's upcoming Google Calendar events to understand their schedule. Only call if Google is connected.",
    input_schema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "How many days ahead to look (default 7)",
        },
      },
      required: [],
    },
  },
  {
    name: "get_instagram_posts",
    description:
      "Read user's recent Instagram posts to understand their interests and passions. Only call if Instagram is connected.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export async function runAgent(
  messages: AgentMessage[],
  profile: Partial<UserProfile> | undefined,
  sessionId: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "Anthropic API key not configured.";
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const googleOk = isGoogleConnected(sessionId);
  const igOk = isInstagramConnected(sessionId);

  // Inject connection status into system prompt
  const connectionNote = [
    googleOk ? "✓ Gmail and Google Calendar are connected." : "✗ Gmail/Google not connected.",
    igOk ? "✓ Instagram is connected." : "✗ Instagram not connected.",
    !googleOk || !igOk
      ? "Tell the user they can connect missing accounts at /connect to unlock deeper personalisation."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const systemPrompt =
    buildSystemPrompt(profile) +
    `\n\nCONNECTED SERVICES: ${connectionNote}\n` +
    `You are operating as a goal-oriented agent. You have access to tools to search career data, read emails, check calendar, and read Instagram — use them to give highly personalised, grounded guidance. Think step by step before calling tools. Only call a tool when it will genuinely improve your answer. Never fabricate data.`;

  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const MAX_ITERATIONS = 6;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      tools: AGENT_TOOLS,
      messages: apiMessages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock ? (textBlock as Anthropic.TextBlock).text : "";
    }

    if (response.stop_reason === "tool_use") {
      // Append assistant message (including thinking + tool_use blocks)
      apiMessages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        let result: string;
        try {
          switch (block.name) {
            case "search_careers_semantic": {
              const inp = block.input as { query: string; topK?: number };
              const { formatted } = await semanticRetrieve(inp.query, profile, inp.topK ?? 3);
              result = formatted || "No relevant careers found.";
              break;
            }
            case "read_recent_emails": {
              const inp = block.input as { maxResults?: number; query?: string };
              result = await readRecentEmails(sessionId, inp.maxResults ?? 10, inp.query ?? "");
              break;
            }
            case "get_google_profile": {
              result = await getGoogleProfile(sessionId);
              break;
            }
            case "get_calendar_events": {
              const inp = block.input as { days?: number };
              result = await getCalendarEvents(sessionId, inp.days ?? 7);
              break;
            }
            case "get_instagram_posts": {
              result = await getInstagramPosts(sessionId);
              break;
            }
            default:
              result = `Unknown tool: ${block.name}`;
          }
        } catch (err) {
          result = `Tool error: ${err instanceof Error ? err.message : String(err)}`;
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }

      apiMessages.push({ role: "user", content: toolResults });
    }
  }

  return "I processed your request but hit my iteration limit. Try asking a more specific question.";
}
