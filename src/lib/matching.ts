import type { Career, CareerMatch, GPSReport, UserProfile } from "@/types";
import { careers } from "@/data/careers";

// Education stream → subject keywords mapping
const streamSubjectMap: Record<string, string[]> = {
  science: ["mathematics", "physics", "chemistry", "biology", "computer science", "statistics"],
  commerce: ["accounting", "finance", "economics", "business studies", "statistics", "commerce"],
  arts: ["history", "geography", "political science", "psychology", "sociology", "english", "literature"],
  engineering: ["mathematics", "physics", "programming", "electronics", "mechanical", "civil", "computer science"],
  medicine: ["biology", "chemistry", "anatomy", "physiology", "microbiology", "pharmacology"],
  "computer science": ["programming", "data structures", "algorithms", "mathematics", "software engineering"],
  management: ["finance", "marketing", "operations", "hr", "business strategy", "economics"],
  design: ["visual design", "graphic design", "typography", "color theory", "illustration"],
  law: ["constitutional law", "criminal law", "corporate law", "legal reasoning"],
  social_work: ["social work", "sociology", "psychology", "community development"],
};

const riskToleranceMap = { low: 1, medium: 5, high: 9 };

function normalize(val: number, min: number, max: number): number {
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
}

function scoreEducationFit(user: UserProfile, career: Career): number {
  const userSubjects = user.subjects.map((s) => s.toLowerCase());
  const stream = user.educationStream.toLowerCase();
  const streamKeywords = streamSubjectMap[stream] || [];
  const allUserKeywords = [...userSubjects, ...streamKeywords];

  let matchCount = 0;
  const totalRequired = career.requiredSkills.length + career.preferredBackgrounds.length;

  career.preferredBackgrounds.forEach((bg) => {
    if (allUserKeywords.some((k) => bg.toLowerCase().includes(k) || k.includes(bg.toLowerCase()))) {
      matchCount += 2;
    }
  });

  career.requiredEducation.forEach((edu) => {
    if (edu.toLowerCase().includes("any") || edu.toLowerCase().includes("no degree")) {
      matchCount += 2;
    }
    if (allUserKeywords.some((k) => edu.toLowerCase().includes(k))) {
      matchCount += 1;
    }
  });

  return Math.min(100, (matchCount / Math.max(totalRequired, 1)) * 100);
}

function scoreInterestFit(user: UserProfile, career: Career): number {
  const userInterests = user.interests.map((i) => i.toLowerCase());
  const matched = career.interestsMatched.filter((ci) =>
    userInterests.some((ui) => ci.toLowerCase().includes(ui) || ui.includes(ci.toLowerCase()))
  );
  return Math.min(100, (matched.length / Math.max(career.interestsMatched.length, 1)) * 100);
}

function scoreSkillFit(user: UserProfile, career: Career): number {
  const userSkills = user.currentSkills.map((s) => s.toLowerCase());
  if (userSkills.length === 0) return 30; // base score for no skills listed

  const matched = career.requiredSkills.filter((rs) =>
    userSkills.some((us) => rs.toLowerCase().includes(us) || us.includes(rs.toLowerCase()))
  );
  return Math.min(100, (matched.length / Math.max(career.requiredSkills.length, 1)) * 100);
}

function scoreWorkStyleFit(user: UserProfile, career: Career): number {
  const userStyle = user.workStyle.map((s) => s.toLowerCase());
  const matched = career.workStyleFit.filter((ws) =>
    userStyle.some((us) => ws.includes(us) || us.includes(ws))
  );
  return Math.min(100, (matched.length / Math.max(career.workStyleFit.length, 1)) * 100);
}

function scoreValuesFit(user: UserProfile, career: Career): number {
  const userValues = user.values.map((v) => v.toLowerCase());
  const matched = career.valuesFit.filter((cv) =>
    userValues.some((uv) => cv.includes(uv) || uv.includes(cv))
  );
  return Math.min(100, (matched.length / Math.max(career.valuesFit.length, 1)) * 100);
}

function scoreRiskFit(user: UserProfile, career: Career): number {
  const userRisk = riskToleranceMap[user.riskTolerance];
  const diff = Math.abs(userRisk - career.riskScore);
  return Math.max(0, 100 - diff * 12);
}

function scoreTimelineFit(user: UserProfile, career: Career): number {
  const timelineMap: Record<string, number> = {
    "asap": 3,
    "3months": 3,
    "6months": 6,
    "1year": 12,
    "2years": 24,
    "flexible": 18,
  };
  const userMonths = timelineMap[user.timeline] || 12;
  if (career.timelineMonths <= userMonths) return 100;
  if (career.timelineMonths <= userMonths * 1.5) return 70;
  if (career.timelineMonths <= userMonths * 2) return 40;
  return 15;
}

function scoreTechComfort(user: UserProfile, career: Career): number {
  const techTools = career.tools.filter((t) =>
    ["python", "sql", "excel", "code", "software", "ai", "api", "cloud"].some((k) =>
      t.toLowerCase().includes(k)
    )
  );
  const techRequired = techTools.length > 3 ? "high" : techTools.length > 1 ? "medium" : "low";
  const techRequiredScore = techRequired === "high" ? 8 : techRequired === "medium" ? 5 : 2;
  const diff = Math.abs(user.techComfort - techRequiredScore);
  return Math.max(0, 100 - diff * 10);
}

function scorePeopleComfort(user: UserProfile, career: Career): number {
  const peopleFacing = career.workStyleFit.includes("collaborative") || career.interestsMatched.includes("people");
  const peopleRequired = peopleFacing ? 7 : 3;
  const diff = Math.abs(user.peopleComfort - peopleRequired);
  return Math.max(0, 100 - diff * 10);
}

function scoreCreativeAnalytical(user: UserProfile, career: Career): number {
  const isCreative = ["Design", "Creative", "Media"].includes(career.category);
  const isAnalytical = ["Technology", "Finance", "Healthcare"].includes(career.category);

  if (isCreative) {
    const diff = Math.abs(user.creativeComfort - 8);
    return Math.max(0, 100 - diff * 12);
  }
  if (isAnalytical) {
    const diff = Math.abs(user.analyticalComfort - 8);
    return Math.max(0, 100 - diff * 12);
  }
  return 60; // neutral categories
}

function buildWhyMatches(user: UserProfile, career: Career, scores: Record<string, number>): string[] {
  const reasons: string[] = [];
  if (scores.interest >= 60) reasons.push(`Your interests in ${career.interestsMatched.slice(0, 2).join(" and ")} align with this role`);
  if (scores.workStyle >= 60) reasons.push(`Your preferred ${user.workStyle[0] || "flexible"} work style fits this career`);
  if (scores.values >= 60) reasons.push(`This career supports your values around ${career.valuesFit.slice(0, 2).join(" and ")}`);
  if (scores.skills >= 50) reasons.push(`Some of your existing skills transfer directly`);
  if (scores.education >= 60) reasons.push(`Your educational background aligns with entry requirements`);
  if (career.remoteFriendlyScore >= 7) reasons.push("Strong remote work opportunities");
  if (career.demandScore >= 8) reasons.push("High market demand — good hiring prospects");
  if (reasons.length === 0) reasons.push("This is a growth area that matches your exploration goals");
  return reasons;
}

function buildConcerns(user: UserProfile, career: Career, scores: Record<string, number>): string[] {
  const concerns: string[] = [];
  if (scores.skills < 30) concerns.push(`You'll need to build several new skills including ${career.requiredSkills[0]}`);
  if (scores.timeline < 40) concerns.push(`This career typically takes ${career.timelineMonths} months to enter — longer than your target`);
  if (career.difficultyScore >= 8) concerns.push("This is a demanding career path — expect steep learning curves");
  if (career.riskScore >= 7 && user.riskTolerance === "low") concerns.push("This career has higher income variability than you prefer");
  if (career.remoteFriendlyScore <= 3) concerns.push("Limited remote work options");
  if (concerns.length === 0) concerns.push("No major concerns — strong overall fit");
  return concerns;
}

export function scoreCareer(user: UserProfile, career: Career): { total: number; breakdown: Record<string, number> } {
  const scores = {
    education: scoreEducationFit(user, career),
    interest: scoreInterestFit(user, career),
    skills: scoreSkillFit(user, career),
    workStyle: scoreWorkStyleFit(user, career),
    values: scoreValuesFit(user, career),
    risk: scoreRiskFit(user, career),
    timeline: scoreTimelineFit(user, career),
    tech: scoreTechComfort(user, career),
    people: scorePeopleComfort(user, career),
    creativeAnalytical: scoreCreativeAnalytical(user, career),
  };

  // Weighted average
  const weights = {
    interest: 0.22,
    workStyle: 0.15,
    values: 0.15,
    skills: 0.15,
    education: 0.10,
    risk: 0.08,
    timeline: 0.05,
    tech: 0.05,
    people: 0.03,
    creativeAnalytical: 0.02,
  };

  const total = Object.entries(weights).reduce((sum, [key, w]) => {
    return sum + (scores[key as keyof typeof scores] || 0) * w;
  }, 0);

  return { total: Math.round(total), breakdown: scores };
}

export function generateMatches(user: UserProfile): {
  topMatches: CareerMatch[];
  safeMatches: CareerMatch[];
  wildcardMatches: CareerMatch[];
  stretchMatches: CareerMatch[];
} {
  // Filter out avoided careers
  const eligibleCareers = careers.filter(
    (c) => !user.careersAvoided.some((a) => c.title.toLowerCase().includes(a.toLowerCase()))
  );

  const scored = eligibleCareers.map((career) => {
    const { total, breakdown } = scoreCareer(user, career);
    const whyMatches = buildWhyMatches(user, career, breakdown);
    const concerns = buildConcerns(user, career, breakdown);

    return {
      career,
      matchScore: total,
      matchType: "top" as CareerMatch["matchType"],
      whyMatches,
      concerns,
      educationFit: Math.round(breakdown.education),
      interestFit: Math.round(breakdown.interest),
      skillFit: Math.round(breakdown.skills),
      workStyleFit: Math.round(breakdown.workStyle),
      valuesFit: Math.round(breakdown.values),
    };
  });

  // Sort by score
  const sorted = [...scored].sort((a, b) => b.matchScore - a.matchScore);

  // Top matches: highest scores overall
  const topMatches = sorted.slice(0, 5).map((m) => ({ ...m, matchType: "top" as const }));

  // Safe matches: conventional/stable, risk score <= 3
  const safeMatches = sorted
    .filter((m) => m.career.type === "conventional" && m.career.riskScore <= 3)
    .slice(0, 3)
    .map((m) => ({ ...m, matchType: "safe" as const }));

  // Wildcard matches: unconventional/emerging with decent score
  const wildcardMatches = sorted
    .filter((m) => m.career.type === "unconventional" || m.career.type === "emerging" || m.career.type === "niche")
    .slice(0, 3)
    .map((m) => ({ ...m, matchType: "wildcard" as const }));

  // Stretch matches: high difficulty, high growth potential
  const stretchMatches = sorted
    .filter((m) => m.career.difficultyScore >= 7 && m.career.growthPotential >= 8)
    .slice(0, 3)
    .map((m) => ({ ...m, matchType: "stretch" as const }));

  return { topMatches, safeMatches, wildcardMatches, stretchMatches };
}

export function detectStrengths(user: UserProfile): string[] {
  const strengths: string[] = [];
  if (user.techComfort >= 7) strengths.push("Strong technology comfort");
  if (user.analyticalComfort >= 7) strengths.push("High analytical thinking ability");
  if (user.creativeComfort >= 7) strengths.push("Strong creative capacity");
  if (user.peopleComfort >= 7) strengths.push("Excellent people and communication skills");
  if (user.currentSkills.length >= 5) strengths.push(`Diverse skill set: ${user.currentSkills.slice(0, 3).join(", ")}`);
  if (user.interests.length >= 5) strengths.push("Wide range of interests enabling cross-disciplinary roles");
  if (user.riskTolerance === "high") strengths.push("High risk tolerance opens entrepreneurial and emerging career paths");
  if (user.values.includes("learning")) strengths.push("Growth mindset — a core advantage in any career");
  if (strengths.length === 0) strengths.push("Openness to exploration is itself a strength");
  return strengths;
}

export function detectOverallGaps(user: UserProfile, topMatches: CareerMatch[]): string[] {
  const gaps: string[] = [];
  const allRequired = topMatches.flatMap((m) => m.career.requiredSkills);
  const uniqueRequired = [...new Set(allRequired)];
  const userSkillsLower = user.currentSkills.map((s) => s.toLowerCase());
  const missing = uniqueRequired.filter(
    (req) => !userSkillsLower.some((us) => req.toLowerCase().includes(us) || us.includes(req.toLowerCase()))
  );
  return missing.slice(0, 6);
}

export function generateGPSReport(user: UserProfile): GPSReport {
  const { topMatches, safeMatches, wildcardMatches, stretchMatches } = generateMatches(user);
  const strengths = detectStrengths(user);
  const gaps = detectOverallGaps(user, topMatches);

  const sevenDayPlan = [
    `Research your top match: ${topMatches[0]?.career.title || "career"}`,
    "Update your LinkedIn profile with current skills and interests",
    `Complete one free introductory resource: ${topMatches[0]?.career.freeResources[0]?.title || "online course"}`,
    "Connect with 3 professionals in your target industry on LinkedIn",
    `Watch 2 'day in the life' videos for ${topMatches[0]?.career.title || "your target role"}`,
    "Write a 1-page self-assessment of your current skills vs. target skills",
    "Join one online community in your chosen career space",
  ];

  const thirtyDayPlan = [
    `Complete a beginner project: ${topMatches[0]?.career.beginnerProjects[0] || "build a portfolio project"}`,
    `Enroll in a free certification: ${topMatches[0]?.career.freeResources[0]?.platform || "Coursera"}`,
    "Conduct 2 informational interviews with people in your target role",
    "Build or update your portfolio/resume for the target role",
    "Apply to 5 internships or junior roles to test market readiness",
    "Document your learning progress in a public blog or LinkedIn post",
  ];

  const ninetyDayPlan = [
    `Complete your first paid certification: ${topMatches[0]?.career.paidCertifications[0]?.title || "relevant certification"}`,
    "Build 2 portfolio projects that demonstrate core skills",
    "Apply to 20 target roles and track responses",
    "Attend at least 1 industry event or virtual meetup",
    "Request feedback on your portfolio from 3 professionals",
    "Refine your personal brand and online presence completely",
  ];

  return {
    userProfile: user,
    generatedAt: new Date().toISOString(),
    topMatches,
    safeMatches,
    wildcardMatches,
    stretchMatches,
    strengthsDetected: strengths,
    overallGaps: gaps,
    sevenDayPlan,
    thirtyDayPlan,
    ninetyDayPlan,
  };
}
