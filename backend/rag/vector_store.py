"""In-memory numpy vector store with cosine similarity search."""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Generic, TypeVar
import numpy as np

T = TypeVar("T")


@dataclass
class VectorEntry(Generic[T]):
    id: str
    embedding: np.ndarray
    metadata: T


@dataclass
class InMemoryVectorStore(Generic[T]):
    _entries: list[VectorEntry[T]] = field(default_factory=list)

    def add(self, entry: VectorEntry[T]) -> None:
        self._entries.append(entry)

    def search(self, query: np.ndarray, top_k: int = 3) -> list[tuple[VectorEntry[T], float]]:
        if not self._entries:
            return []
        matrix = np.stack([e.embedding for e in self._entries])
        scores = matrix @ query          # embeddings are already L2-normalised → dot = cosine
        top_idx = np.argsort(scores)[::-1][:top_k]
        return [(self._entries[i], float(scores[i])) for i in top_idx]

    @property
    def size(self) -> int:
        return len(self._entries)
