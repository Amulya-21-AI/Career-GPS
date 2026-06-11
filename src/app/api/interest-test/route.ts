import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/future-me-prompt";
import { chat } from "@/lib/ai/provider";
import type { UserProfile } from "@/types";

const SCORE_PROMPT = (answers: Record<string, string>) => `
The user completed an interest test. Here are their answers to 8 scenario-based questions:

${Object.entries(answers)
  .map(([q, a]) => `Q: ${q}\nA: ${a}`)
  .join("\n\n")}

Score them on these 7 dimensions (1–10 each) and give a 2-sentence summary.
Return ONLY valid JSON in this exact format:
{
  "interestFit": 7,
  "skillFit": 6,
  "disciplineLevel": 5,
  "careerScope": 8,
  "creativePotential": 7,
  "riskLevel": 6,
  "streamAlignment": 8,
  "summary": "Two sentences about the user's overall direction and biggest insight."
}
`;

export async function POST(req: NextRequest) {
  try {
    const { answers, profile } = await req.json();

    if (!answers) {
      return NextResponse.json({ error: "answers required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_key_here") {
      // Mock scores
      return NextResponse.json({
        interestFit: 7,
        skillFit: 5,
        disciplineLevel: 6,
        careerScope: 8,
        creativePotential: 7,
        riskLevel: 5,
        streamAlignment: 7,
        summary: "Your interests and chosen path are more aligned than you might think. The biggest opportunity is converting your curiosity into tangible projects.",
      });
    }

    const systemPrompt = buildSystemPrompt(profile as Partial<UserProfile>);
    const result = await chat(systemPrompt, [
      { role: "user", content: SCORE_PROMPT(answers) },
    ]);

    // Extract JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const scores = JSON.parse(jsonMatch[0]);

    return NextResponse.json(scores);
  } catch (err) {
    console.error("Interest test API error:", err);
    return NextResponse.json({ error: "Failed to score test" }, { status: 500 });
  }
}
