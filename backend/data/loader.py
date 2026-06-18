"""Loads careers from careers.json into Pydantic models."""
import json
from pathlib import Path
from ..models import Career

_path = Path(__file__).parent / "careers.json"

with open(_path, encoding="utf-8") as f:
    _raw = json.load(f)

careers: list[Career] = [Career(**c) for c in _raw]


def get_career_by_id(career_id: str) -> Career | None:
    return next((c for c in careers if c.id == career_id), None)


def get_careers_by_category(category: str) -> list[Career]:
    return [c for c in careers if c.category == category]
