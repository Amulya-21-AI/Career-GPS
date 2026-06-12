import { careers } from "@/data/careers";
import type { Career, UserProfile } from "@/types";

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2)
  );
}

function overlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const t of a) if (b.has(t)) count++;
  return count;
}

function scoreCareer(
  career: Career,
  queryTokens: Set<string>,
  profile?: Partial<UserProfile>
): number {
  let score = 0;

  // Title match (high weight)
  const titleTokens = tokenize(career.title);
  score += overlap(queryTokens, titleTokens) * 4;

  // Category and description
  score += overlap(queryTokens, tokenize(career.category)) * 2;
  score += overlap(queryTokens, tokenize(career.description));

  // Skills and tools
  const skillsText = [...career.requiredSkills, ...career.niceToHaveSkills, ...career.tools].join(" ");
  score += overlap(queryTokens, tokenize(skillsText)) * 2;

  // Interests
  score += overlap(queryTokens, tokenize(career.interestsMatched.join(" "))) * 2;

  // Bonus for profile match
  if (profile) {
    const profileInterests = tokenize((profile.interests || []).join(" "));
    score += overlap(profileInterests, new Set(career.interestsMatched.map((s) => s.toLowerCase()))) * 3;

    const profileSkills = tokenize((profile.currentSkills || []).join(" "));
    score += overlap(profileSkills, tokenize(skillsText)) * 2;

    const profileStream = tokenize(profile.educationStream || "");
    score += overlap(profileStream, tokenize(career.preferredBackgrounds.join(" "))) * 2;

    // Risk alignment
    if (profile.riskTolerance === "low" && career.riskScore <= 4) score += 2;
    if (profile.riskTolerance === "high" && career.riskScore >= 7) score += 2;
  }

  return score;
}

export interface RetrievedContext {
  careers: Career[];
  formatted: string;
}

export function retrieveContext(
  userMessage: string,
  profile?: Partial<UserProfile>,
  topK = 3
): RetrievedContext {
  const queryTokens = tokenize(userMessage);

  // Also expand query with profile interests for better recall
  if (profile?.interests) {
    for (const t of tokenize(profile.interests.join(" "))) {
      queryTokens.add(t);
    }
  }

  const scored = careers
    .map((c) => ({ career: c, score: scoreCareer(c, queryTokens, profile) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.career);

  return {
    careers: scored,
    formatted: formatContext(scored),
  };
}

function formatContext(careers: Career[]): string {
  if (careers.length === 0) return "";

  const blocks = careers.map((c) => `
CAREER: ${c.title} (${c.category})
Description: ${c.description}
Required Skills: ${c.requiredSkills.slice(0, 5).join(", ")}
Salary Entry: ${c.salaryRangeEntry} | Mid: ${c.salaryRangeMid} | Senior: ${c.salaryRangeSenior}
Timeline to job-ready: ~${c.timelineMonths} months
Remote score: ${c.remoteFriendlyScore}/10 | Demand: ${c.demandScore}/10 | Difficulty: ${c.difficultyScore}/10
Entry pathways: ${c.entryPathways.slice(0, 2).join("; ")}
Beginner projects: ${c.beginnerProjects.slice(0, 2).join("; ")}
`.trim());

  return `RELEVANT CAREER DATA FROM YOUR KNOWLEDGE BASE:\n${blocks.join("\n\n")}`;
}
