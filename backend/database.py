"""SQLite database setup — raw sqlite3 to avoid Python 3.14 / SQLAlchemy clash."""
import os
import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db/career_gps.db")

# Resolve path from the URL
if DATABASE_URL.startswith("sqlite:///"):
    _db_path = DATABASE_URL[len("sqlite:///"):]
else:
    _db_path = "./db/career_gps.db"

_db_path = os.path.abspath(_db_path)
os.makedirs(os.path.dirname(_db_path), exist_ok=True)

_local = threading.local()


def _get_conn() -> sqlite3.Connection:
    if not getattr(_local, "conn", None):
        _local.conn = sqlite3.connect(_db_path)
        _local.conn.row_factory = sqlite3.Row
        _local.conn.execute("PRAGMA journal_mode=WAL")
    return _local.conn


@contextmanager
def get_db():
    conn = _get_conn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise


# ── Schema ────────────────────────────────────────────────────────────────────

_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_profiles (
    id                  TEXT PRIMARY KEY,
    name                TEXT DEFAULT '',
    age_range           TEXT DEFAULT '',
    stage               TEXT DEFAULT 'college',
    country             TEXT DEFAULT '',
    education_stream    TEXT DEFAULT '',
    degree              TEXT DEFAULT '',
    subjects            TEXT DEFAULT '[]',
    current_skills      TEXT DEFAULT '[]',
    interests           TEXT DEFAULT '[]',
    work_style          TEXT DEFAULT '[]',
    "values"            TEXT DEFAULT '[]',
    work_environment    TEXT DEFAULT '',
    risk_tolerance      TEXT DEFAULT 'medium',
    desired_income      TEXT DEFAULT '',
    timeline            TEXT DEFAULT '',
    tech_comfort        INTEGER DEFAULT 5,
    people_comfort      INTEGER DEFAULT 5,
    creative_comfort    INTEGER DEFAULT 5,
    analytical_comfort  INTEGER DEFAULT 5,
    careers_considered  TEXT DEFAULT '[]',
    careers_avoided     TEXT DEFAULT '[]',
    created_at          TEXT DEFAULT (datetime('now')),
    updated_at          TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id          TEXT PRIMARY KEY,
    user_id     TEXT REFERENCES user_profiles(id),
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT REFERENCES chat_sessions(id),
    role        TEXT,
    content     TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS interest_test_results (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             TEXT REFERENCES user_profiles(id),
    interest_fit        INTEGER,
    skill_fit           INTEGER,
    discipline_level    INTEGER,
    career_scope        INTEGER,
    creative_potential  INTEGER,
    risk_level          INTEGER,
    stream_alignment    INTEGER,
    summary             TEXT,
    completed_at        TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS career_match_results (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      TEXT REFERENCES user_profiles(id),
    career_id    TEXT,
    career_title TEXT,
    match_score  INTEGER,
    match_type   TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
);
"""


def create_tables():
    conn = _get_conn()
    conn.executescript(_SCHEMA)
    conn.commit()
    print("Database tables ready:", _db_path)
