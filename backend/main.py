# Python 3.14 removed check_same_thread from sqlite3 — patch before any imports.
import sqlite3 as _sqlite3_py314_compat
_orig_sqlite3_connect = _sqlite3_py314_compat.connect
def _patched_sqlite3_connect(*args, **kwargs):
    kwargs.pop("check_same_thread", None)
    return _orig_sqlite3_connect(*args, **kwargs)
_sqlite3_py314_compat.connect = _patched_sqlite3_connect  # type: ignore[assignment]

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_tables
from .routers import chat, match, report, interest_test

app = FastAPI(title="Career GPS — Python Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create SQLite tables and pre-warm vector store on startup
@app.on_event("startup")
async def startup():
    create_tables()
    # Pre-warm the semantic vector store so first chat request is fast
    try:
        from .rag.semantic_retriever import _get_store
        await _get_store()
    except Exception as e:
        print(f"[Startup] Vector store pre-warm skipped: {e}")

app.include_router(chat.router,          prefix="/api")
app.include_router(match.router,         prefix="/api")
app.include_router(report.router,        prefix="/api")
app.include_router(interest_test.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
