import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamChat(
  systemPrompt: string,
  messages: AIMessage[],
  onChunk: (text: string) => void
): Promise<string> {
  const ai = getClient();
  let full = "";

  const stream = ai.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      onChunk(chunk.delta.text);
      full += chunk.delta.text;
    }
  }

  return full;
}

export async function chat(
  systemPrompt: string,
  messages: AIMessage[]
): Promise<string> {
  const ai = getClient();

  const response = await ai.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

// Mock fallback when no API key
export function mockFutureMe(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("roadmap")) {
    return `**From Your Future Self:**
You asked for a roadmap — smart move. Most people drift without one.

**Your Roadmap:**
**Next 7 Days:** Audit your current skills honestly. Write down what you actually know vs. what you think you know.
**Next 30 Days:** Pick ONE skill gap and start a beginner project. Don't just watch tutorials — build something.
**Next 3 Months:** Have one tangible output to show (a project, a certificate, a portfolio piece).
**Next 6 Months:** Apply to 10 opportunities — internships, freelance work, or open-source contributions.
**Next 1 Year:** You should have either a clear career direction validated by real experience, or evidence that you need to pivot.

**Your Next 3 Actions:**
1. Complete your Career GPS profile if you haven't
2. Take the Interest Test to confirm your direction
3. Start one beginner project this week`;
  }

  if (lower.includes("interest test") || lower.includes("test")) {
    return `Let's run a quick interest test. I'll send you to the Interest Test page — it takes 5 minutes and will tell you how aligned your current path actually is with what you genuinely want.

Click **Take Interest Test** below or navigate to /interest-test.`;
  }

  return `**From Your Future Self:**
I remember asking the same thing. Here's what I know now that you don't yet.

The answer isn't complicated — it's just uncomfortable. Your current path has more potential than you're using. The problem isn't your stream or degree. It's that you're waiting to feel ready before you start.

**The Honest Truth:** You have more time than you think, but less runway than you feel. The gap between where you are and where you want to be closes with consistent small actions, not one big break.

**Your Next 3 Actions:**
1. Take the Career GPS quiz if you haven't — it'll show your best-fit directions
2. Go to the Interest Test and check if your gut matches your head
3. Come back and ask me something specific about your next move`;
}
