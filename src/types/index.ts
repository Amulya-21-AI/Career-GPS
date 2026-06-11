export type CareerType = "conventional" | "unconventional" | "emerging" | "niche";

export interface Resource {
  title: string;
  url: string;
  platform: string;
  free: boolean;
}

export interface Certification {
  title: string;
  provider: string;
  url: string;
  cost: string;
  duration: string;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  type: CareerType;
  description: string;
  dayInLife: string;
  suitedFor: string[];
  notSuitedFor: string[];
  requiredEducation: string[];
  preferredBackgrounds: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  tools: string[];
  interestsMatched: string[];
  workStyleFit: string[];
  valuesFit: string[];
  entryPathways: string[];
  beginnerProjects: string[];
  portfolioIdeas: string[];
  freeResources: Resource[];
  paidCertifications: Certification[];
  timelineMonths: number;
  salaryRangeEntry: string;
  salaryRangeMid: string;
  salaryRangeSenior: string;
  remoteFriendlyScore: number;
  demandScore: number;
  difficultyScore: number;
  riskScore: number;
  growthPotential: number;
  relatedCareers: string[];
}

export interface UserProfile {
  name: string;
  ageRange: string;
  stage: "after12th" | "college" | "freshGrad" | "professional";
  country: string;
  educationStream: string;
  degree: string;
  subjects: string[];
  currentSkills: string[];
  interests: string[];
  workStyle: string[];
  values: string[];
  workEnvironment: string;
  riskTolerance: "low" | "medium" | "high";
  desiredIncome: string;
  timeline: string;
  techComfort: number;
  peopleComfort: number;
  creativeComfort: number;
  analyticalComfort: number;
  careersConsidered: string[];
  careersAvoided: string[];
}

export interface QuizAnswer {
  step: number;
  field: keyof UserProfile;
  value: unknown;
}

export interface CareerMatch {
  career: Career;
  matchScore: number;
  matchType: "top" | "safe" | "wildcard" | "stretch";
  whyMatches: string[];
  concerns: string[];
  educationFit: number;
  interestFit: number;
  skillFit: number;
  workStyleFit: number;
  valuesFit: number;
}

export interface SkillGap {
  skill: string;
  status: "have" | "partial" | "missing";
  priority: "high" | "medium" | "low";
  resources: Resource[];
}

export interface GapAnalysis {
  careerId: string;
  strongAreas: string[];
  missingSkills: SkillGap[];
  buildFirst: string[];
  estimatedWeeksToInternship: number;
  estimatedWeeksToEntry: number;
  suggestedRoadmap: RoadmapStep[];
}

export interface RoadmapStep {
  week: string;
  title: string;
  description: string;
  actions: string[];
  resources: Resource[];
}

export interface GPSReport {
  userProfile: UserProfile;
  generatedAt: string;
  topMatches: CareerMatch[];
  safeMatches: CareerMatch[];
  wildcardMatches: CareerMatch[];
  stretchMatches: CareerMatch[];
  strengthsDetected: string[];
  overallGaps: string[];
  sevenDayPlan: string[];
  thirtyDayPlan: string[];
  ninetyDayPlan: string[];
  aiSummary?: string;
}

export interface InterestTestResult {
  interestFit: number;
  skillFit: number;
  disciplineLevel: number;
  careerScope: number;
  creativePotential: number;
  riskLevel: number;
  streamAlignment: number;
  summary: string;
  completedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface InterestTestQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  type: "scenario" | "wouldYouRather" | "scale";
}
