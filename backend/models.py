"""Pydantic request/response models for the API."""
from typing import Optional, Literal
from pydantic import BaseModel


class Resource(BaseModel):
    title: str
    url: str
    platform: str
    free: bool


class Certification(BaseModel):
    title: str
    provider: str
    url: str
    cost: str
    duration: str


class Career(BaseModel):
    id: str
    title: str
    category: str
    type: Literal["conventional", "unconventional", "emerging", "niche"]
    description: str
    dayInLife: str
    suitedFor: list[str]
    notSuitedFor: list[str]
    requiredEducation: list[str]
    preferredBackgrounds: list[str]
    requiredSkills: list[str]
    niceToHaveSkills: list[str]
    tools: list[str]
    interestsMatched: list[str]
    workStyleFit: list[str]
    valuesFit: list[str]
    entryPathways: list[str]
    beginnerProjects: list[str]
    portfolioIdeas: list[str]
    freeResources: list[Resource]
    paidCertifications: list[Certification]
    timelineMonths: int
    salaryRangeEntry: str
    salaryRangeMid: str
    salaryRangeSenior: str
    remoteFriendlyScore: int
    demandScore: int
    difficultyScore: int
    riskScore: int
    growthPotential: int
    relatedCareers: list[str]


class UserProfileIn(BaseModel):
    id: str = "guest"
    name: str = ""
    ageRange: str = ""
    stage: Literal["after12th", "college", "freshGrad", "professional"] = "college"
    country: str = ""
    educationStream: str = ""
    degree: str = ""
    subjects: list[str] = []
    currentSkills: list[str] = []
    interests: list[str] = []
    workStyle: list[str] = []
    values: list[str] = []
    workEnvironment: str = ""
    riskTolerance: Literal["low", "medium", "high"] = "medium"
    desiredIncome: str = ""
    timeline: str = ""
    techComfort: int = 5
    peopleComfort: int = 5
    creativeComfort: int = 5
    analyticalComfort: int = 5
    careersConsidered: list[str] = []
    careersAvoided: list[str] = []


class CareerMatch(BaseModel):
    career: Career
    matchScore: int
    matchType: Literal["top", "safe", "wildcard", "stretch"]
    whyMatches: list[str]
    concerns: list[str]
    educationFit: int
    interestFit: int
    skillFit: int
    workStyleFit: int
    valuesFit: int


class GPSReport(BaseModel):
    userProfile: UserProfileIn
    generatedAt: str
    topMatches: list[CareerMatch]
    safeMatches: list[CareerMatch]
    wildcardMatches: list[CareerMatch]
    stretchMatches: list[CareerMatch]
    strengthsDetected: list[str]
    overallGaps: list[str]
    sevenDayPlan: list[str]
    thirtyDayPlan: list[str]
    ninetyDayPlan: list[str]
    aiSummary: Optional[str] = None


class ChatMessageIn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    messages: list[ChatMessageIn]
    profile: Optional[UserProfileIn] = None


class MatchRequest(BaseModel):
    profile: UserProfileIn


class ReportRequest(BaseModel):
    profile: UserProfileIn


class InterestTestRequest(BaseModel):
    answers: dict[str, str]
    profile: Optional[UserProfileIn] = None
    user_id: Optional[str] = None
