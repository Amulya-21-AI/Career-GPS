"""Keyword-based fallback retriever — works even without the ML model."""
from __future__ import annotations
import re
from typing import Optional
from ..models import Career, UserProfileIn


def _tokenize(text: str) -> set[str]:
    return {t for t in re.sub(r"[^a-z0-9\s]", " ", text.lower()).split() if len(t) > 2}


def _overlap(a: set[str], b: set[str]) -> int:
    return sum(1 for t in a if t in b)


def _score(career: Career, query_tokens: set[str], profile: Optional[UserProfileIn]) -> float:
    score = 0.0
    score += _overlap(query_tokens, _tokenize(career.title)) * 4
    score += _overlap(query_tokens, _tokenize(career.category)) * 2
    score += _overlap(query_tokens, _tokenize(career.description))
    skills = " ".join(career.requiredSkills + career.niceToHaveSkills + career.tools)
    score += _overlap(query_tokens, _tokenize(skills)) * 2
    score += _overlap(query_tokens, _tokenize(" ".join(career.interestsMatched))) * 2
    if profile:
        score += _overlap(_tokenize(" ".join(profile.interests)), {i.lower() for i in career.interestsMatched}) * 3
        score += _overlap(_tokenize(" ".join(profile.currentSkills)), _tokenize(skills)) * 2
        score += _overlap(_tokenize(profile.educationStream), _tokenize(" ".join(career.preferredBackgrounds))) * 2
        if profile.riskTolerance == "low" and career.riskScore <= 4:
            score += 2
        if profile.riskTolerance == "high" and career.riskScore >= 7:
            score += 2
    return score


def _format(careers: list[Career]) -> str:
    if not careers:
        return ""
    blocks = [
        f"CAREER: {c.title} ({c.category})\n"
        f"Description: {c.description}\n"
        f"Required Skills: {', '.join(c.requiredSkills[:5])}\n"
        f"Salary: Entry {c.salaryRangeEntry} | Mid {c.salaryRangeMid} | Senior {c.salaryRangeSenior}\n"
        f"Timeline: ~{c.timelineMonths} months | Remote: {c.remoteFriendlyScore}/10 | Demand: {c.demandScore}/10\n"
        f"Entry pathways: {'; '.join(c.entryPathways[:2])}\n"
        f"Beginner projects: {'; '.join(c.beginnerProjects[:2])}"
        for c in careers
    ]
    return "RELEVANT CAREERS (keyword search):\n\n" + "\n\n".join(blocks)


def retrieve(query: str, profile: Optional[UserProfileIn] = None, top_k: int = 3) -> tuple[list[Career], str]:
    from ..data import careers
    tokens = _tokenize(query)
    if profile:
        tokens |= _tokenize(" ".join(profile.interests))
    scored = sorted(
        [(c, _score(c, tokens, profile)) for c in careers],
        key=lambda x: x[1], reverse=True
    )
    matched = [c for c, s in scored if s > 0][:top_k]
    return matched, _format(matched)
