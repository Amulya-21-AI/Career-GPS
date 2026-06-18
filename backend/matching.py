"""
Career scoring engine — pure Python + math (no external ML library needed).
Weights each dimension and returns ranked CareerMatch lists.
"""
from __future__ import annotations
from datetime import datetime
from .models import Career, CareerMatch, GPSReport, UserProfileIn

STREAM_MAP: dict[str, list[str]] = {
    "science": ["mathematics", "physics", "chemistry", "biology", "computer science", "statistics"],
    "commerce": ["accounting", "finance", "economics", "business studies", "statistics"],
    "arts": ["history", "geography", "political science", "psychology", "sociology", "english"],
    "engineering": ["mathematics", "physics", "programming", "electronics", "computer science"],
    "medicine": ["biology", "chemistry", "anatomy", "physiology", "microbiology"],
    "computer science": ["programming", "data structures", "algorithms", "mathematics"],
    "management": ["finance", "marketing", "operations", "hr", "business strategy"],
    "design": ["visual design", "graphic design", "typography", "color theory"],
    "law": ["constitutional law", "criminal law", "corporate law"],
    "social_work": ["social work", "sociology", "psychology"],
}
RISK_MAP = {"low": 1, "medium": 5, "high": 9}
TIMELINE_MAP = {"asap": 3, "3months": 3, "6months": 6, "1year": 12, "2years": 24, "flexible": 18}
WEIGHTS = {
    "interest": 0.22, "work_style": 0.15, "values": 0.15, "skills": 0.15,
    "education": 0.10, "risk": 0.08, "timeline": 0.05, "tech": 0.05,
    "people": 0.03, "creative_analytical": 0.02,
}


def _has(haystack: str, needles: list[str]) -> bool:
    h = haystack.lower()
    return any(n in h or h in n for n in needles)


def _education(u: UserProfileIn, c: Career) -> float:
    kw = [s.lower() for s in u.subjects] + STREAM_MAP.get(u.educationStream.lower(), [])
    count = sum(2 for bg in c.preferredBackgrounds if _has(bg, kw))
    count += sum(2 for e in c.requiredEducation if "any" in e.lower() or "no degree" in e.lower())
    count += sum(1 for e in c.requiredEducation if _has(e, kw))
    return min(100.0, count / max(len(c.requiredSkills) + len(c.preferredBackgrounds), 1) * 100)


def _interest(u: UserProfileIn, c: Career) -> float:
    ui = [i.lower() for i in u.interests]
    matched = sum(1 for ci in c.interestsMatched if _has(ci, ui))
    return min(100.0, matched / max(len(c.interestsMatched), 1) * 100)


def _skills(u: UserProfileIn, c: Career) -> float:
    if not u.currentSkills:
        return 30.0
    us = [s.lower() for s in u.currentSkills]
    matched = sum(1 for rs in c.requiredSkills if _has(rs, us))
    return min(100.0, matched / max(len(c.requiredSkills), 1) * 100)


def _work_style(u: UserProfileIn, c: Career) -> float:
    us = [s.lower() for s in u.workStyle]
    matched = sum(1 for ws in c.workStyleFit if _has(ws, us))
    return min(100.0, matched / max(len(c.workStyleFit), 1) * 100)


def _values(u: UserProfileIn, c: Career) -> float:
    uv = [v.lower() for v in u.values]
    matched = sum(1 for cv in c.valuesFit if _has(cv, uv))
    return min(100.0, matched / max(len(c.valuesFit), 1) * 100)


def _risk(u: UserProfileIn, c: Career) -> float:
    return max(0.0, 100 - abs(RISK_MAP[u.riskTolerance] - c.riskScore) * 12)


def _timeline(u: UserProfileIn, c: Career) -> float:
    months = TIMELINE_MAP.get(u.timeline, 12)
    if c.timelineMonths <= months:       return 100.0
    if c.timelineMonths <= months * 1.5: return 70.0
    if c.timelineMonths <= months * 2:   return 40.0
    return 15.0


def _tech(u: UserProfileIn, c: Career) -> float:
    tech_kw = ["python", "sql", "excel", "code", "software", "ai", "api", "cloud"]
    count = sum(1 for t in c.tools if any(k in t.lower() for k in tech_kw))
    req = 8 if count > 3 else 5 if count > 1 else 2
    return max(0.0, 100 - abs(u.techComfort - req) * 10)


def _people(u: UserProfileIn, c: Career) -> float:
    req = 7 if "collaborative" in c.workStyleFit or "people" in c.interestsMatched else 3
    return max(0.0, 100 - abs(u.peopleComfort - req) * 10)


def _creative_analytical(u: UserProfileIn, c: Career) -> float:
    if c.category in {"Design", "Creative", "Media"}:
        return max(0.0, 100 - abs(u.creativeComfort - 8) * 12)
    if c.category in {"Technology", "Finance", "Healthcare"}:
        return max(0.0, 100 - abs(u.analyticalComfort - 8) * 12)
    return 60.0


def _score_career(u: UserProfileIn, c: Career) -> tuple[int, dict]:
    s = {
        "education": _education(u, c), "interest": _interest(u, c),
        "skills": _skills(u, c), "work_style": _work_style(u, c),
        "values": _values(u, c), "risk": _risk(u, c), "timeline": _timeline(u, c),
        "tech": _tech(u, c), "people": _people(u, c),
        "creative_analytical": _creative_analytical(u, c),
    }
    total = round(sum(s[k] * w for k, w in WEIGHTS.items()))
    return total, s


def _why(u: UserProfileIn, c: Career, s: dict) -> list[str]:
    r = []
    if s["interest"] >= 60:    r.append(f"Your interests in {' and '.join(c.interestsMatched[:2])} align here")
    if s["work_style"] >= 60:  r.append(f"Your {u.workStyle[0] if u.workStyle else 'flexible'} work style fits")
    if s["values"] >= 60:      r.append(f"Supports your values around {' and '.join(c.valuesFit[:2])}")
    if s["skills"] >= 50:      r.append("Some of your existing skills transfer directly")
    if s["education"] >= 60:   r.append("Your educational background aligns with entry requirements")
    if c.remoteFriendlyScore >= 7: r.append("Strong remote work opportunities")
    if c.demandScore >= 8:     r.append("High market demand — good hiring prospects")
    return r or ["Growth area that matches your exploration goals"]


def _concerns(u: UserProfileIn, c: Career, s: dict) -> list[str]:
    r = []
    if s["skills"] < 30:       r.append(f"Need to build new skills including {c.requiredSkills[0]}")
    if s["timeline"] < 40:     r.append(f"Takes ~{c.timelineMonths} months — longer than your target")
    if c.difficultyScore >= 8: r.append("Demanding path — expect steep learning curves")
    if c.riskScore >= 7 and u.riskTolerance == "low": r.append("Higher income variability than you prefer")
    if c.remoteFriendlyScore <= 3: r.append("Limited remote work options")
    return r or ["No major concerns — strong overall fit"]


def generate_matches(user: UserProfileIn) -> dict[str, list[CareerMatch]]:
    from .data import careers
    eligible = [c for c in careers if not any(a.lower() in c.title.lower() for a in user.careersAvoided)]
    scored = []
    for c in eligible:
        total, breakdown = _score_career(user, c)
        scored.append(CareerMatch(
            career=c, matchScore=total, matchType="top",
            whyMatches=_why(user, c, breakdown), concerns=_concerns(user, c, breakdown),
            educationFit=round(breakdown["education"]), interestFit=round(breakdown["interest"]),
            skillFit=round(breakdown["skills"]), workStyleFit=round(breakdown["work_style"]),
            valuesFit=round(breakdown["values"]),
        ))
    ranked = sorted(scored, key=lambda m: m.matchScore, reverse=True)

    def tag(m: CareerMatch, t: str) -> CareerMatch:
        return m.model_copy(update={"matchType": t})

    return {
        "top":      [tag(m, "top") for m in ranked[:5]],
        "safe":     [tag(m, "safe") for m in ranked if m.career.type == "conventional" and m.career.riskScore <= 3][:3],
        "wildcard": [tag(m, "wildcard") for m in ranked if m.career.type in {"unconventional", "emerging", "niche"}][:3],
        "stretch":  [tag(m, "stretch") for m in ranked if m.career.difficultyScore >= 7 and m.career.growthPotential >= 8][:3],
    }


def detect_strengths(u: UserProfileIn) -> list[str]:
    s = []
    if u.techComfort >= 7:        s.append("Strong technology comfort")
    if u.analyticalComfort >= 7:  s.append("High analytical thinking ability")
    if u.creativeComfort >= 7:    s.append("Strong creative capacity")
    if u.peopleComfort >= 7:      s.append("Excellent people skills")
    if len(u.currentSkills) >= 5: s.append(f"Diverse skill set: {', '.join(u.currentSkills[:3])}")
    if len(u.interests) >= 5:     s.append("Wide range of interests — cross-disciplinary advantage")
    if u.riskTolerance == "high": s.append("High risk tolerance opens entrepreneurial paths")
    if "learning" in u.values:    s.append("Growth mindset — a core advantage in any career")
    return s or ["Openness to exploration is itself a strength"]


def generate_gps_report(user: UserProfileIn) -> GPSReport:
    matches = generate_matches(user)
    top = matches["top"]
    top_title    = top[0].career.title if top else "career"
    top_resource = top[0].career.freeResources[0].title if top and top[0].career.freeResources else "online course"
    top_platform = top[0].career.freeResources[0].platform if top and top[0].career.freeResources else "Coursera"
    top_project  = top[0].career.beginnerProjects[0] if top and top[0].career.beginnerProjects else "build a portfolio project"
    top_cert     = top[0].career.paidCertifications[0].title if top and top[0].career.paidCertifications else "relevant certification"
    gaps         = list(dict.fromkeys(
        s for m in top for s in m.career.requiredSkills
        if not any(s.lower() in us.lower() or us.lower() in s.lower() for us in user.currentSkills)
    ))[:6]

    return GPSReport(
        userProfile=user, generatedAt=datetime.utcnow().isoformat(),
        topMatches=top, safeMatches=matches["safe"],
        wildcardMatches=matches["wildcard"], stretchMatches=matches["stretch"],
        strengthsDetected=detect_strengths(user), overallGaps=gaps,
        sevenDayPlan=[
            f"Research your top match: {top_title}",
            "Update your LinkedIn with current skills and interests",
            f"Complete one free resource: {top_resource}",
            "Connect with 3 professionals in your target industry",
            f"Watch 2 'day in the life' videos for {top_title}",
            "Write a 1-page self-assessment: current vs target skills",
            "Join one online community in your career space",
        ],
        thirtyDayPlan=[
            f"Complete a beginner project: {top_project}",
            f"Enroll in a free course on {top_platform}",
            "Conduct 2 informational interviews with people in your target role",
            "Build or update your portfolio/resume",
            "Apply to 5 internships or junior roles",
            "Document your progress in a public post or blog",
        ],
        ninetyDayPlan=[
            f"Complete your first paid certification: {top_cert}",
            "Build 2 portfolio projects demonstrating core skills",
            "Apply to 20 target roles and track responses",
            "Attend 1 industry event or virtual meetup",
            "Request feedback on your portfolio from 3 professionals",
            "Refine your personal brand and online presence",
        ],
    )
