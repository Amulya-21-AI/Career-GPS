"""Loads all-MiniLM-L6-v2 via sentence-transformers and produces L2-normalised embeddings."""
from __future__ import annotations
import logging
import numpy as np
from typing import Optional

logger = logging.getLogger(__name__)

_model = None
_failed = False


def _get_model():
    global _model, _failed
    if _failed:
        return None
    if _model is not None:
        return _model
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        logger.info("[RAG] Loaded all-MiniLM-L6-v2")
        return _model
    except Exception as e:
        logger.warning(f"[RAG] sentence-transformers unavailable → keyword fallback: {e}")
        _failed = True
        return None


def embed(text: str) -> Optional[np.ndarray]:
    model = _get_model()
    if model is None:
        return None
    try:
        return np.array(model.encode(text, normalize_embeddings=True), dtype=np.float32)
    except Exception as e:
        logger.error(f"[RAG] embed() failed: {e}")
        return None


def is_available() -> bool:
    return not _failed
