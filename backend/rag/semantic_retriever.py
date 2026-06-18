"""Semantic retriever — builds a vector store once, searches on every query."""
from __future__ import annotations
import asyncio
import logging
from typing import Optional
from ..models import Career, UserProfileIn
from .embeddings import embed
from .vector_store import InMemoryVectorStore, VectorEntry

logger = logging.getLogger(__name__)

_store: Optional[InMemoryVectorStore] = None
_lock: Optional[asyncio.Lock] = None


def _career_text(c: Career) -> str:
    return " ".join([
        c.title, c.category, c.description,
        *c.requiredSkills, *c.niceToHaveSkills, *c.tools,
        *c.interestsMatched, *c.preferredBackgrounds, *c.entryPathways,
    ])


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
    return "RELEVANT CAREERS (semantic search):\n\n" + "\n\n".join(blocks)


async def _build_store() -> InMemoryVectorStore:
    from ..data import careers
    logger.info("[RAG] Building semantic vector store…")
    store: InMemoryVectorStore[dict] = InMemoryVectorStore()
    loop = asyncio.get_running_loop()
    for career in careers:
        vec = await loop.run_in_executor(None, embed, _career_text(career))
        if vec is None:
            logger.warning("[RAG] embed() returned None — aborting")
            return store
        store.add(VectorEntry(id=career.id, embedding=vec, metadata={"career": career}))
    logger.info(f"[RAG] Vector store ready — {store.size} careers indexed")
    return store


async def _get_store() -> InMemoryVectorStore:
    global _store, _lock
    if _lock is None:
        _lock = asyncio.Lock()
    if _store is not None:
        return _store
    async with _lock:
        if _store is None:
            _store = await _build_store()
    return _store


async def semantic_retrieve(
    query: str,
    profile: Optional[UserProfileIn] = None,
    top_k: int = 3,
) -> tuple[list[Career], str]:
    try:
        store = await _get_store()
        if store.size == 0:
            return [], ""
        enriched = f"{query} {' '.join(profile.interests)}" if profile and profile.interests else query
        loop = asyncio.get_running_loop()
        q_vec = await loop.run_in_executor(None, embed, enriched)
        if q_vec is None:
            return [], ""
        results = store.search(q_vec, top_k)
        matched = [r[0].metadata["career"] for r in results]
        return matched, _format(matched)
    except Exception as e:
        logger.error(f"[RAG] Semantic retrieval failed: {e}")
        return [], ""
