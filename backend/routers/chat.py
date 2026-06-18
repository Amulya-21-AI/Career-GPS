import asyncio
import uuid
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..models import ChatRequest
from ..database import get_db
from ..rag.retriever import retrieve
from ..rag.semantic_retriever import semantic_retrieve
from ..ai.prompt import build_system_prompt
from ..ai.provider import chat, mock_reply, has_api_key

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(body: ChatRequest):
    session_id = body.session_id or str(uuid.uuid4())

    with get_db() as db:
        existing = db.execute(
            "SELECT id FROM chat_sessions WHERE id = ?", (session_id,)
        ).fetchone()
        if not existing:
            db.execute("INSERT INTO chat_sessions (id) VALUES (?)", (session_id,))

        last_user = next((m for m in reversed(body.messages) if m.role == "user"), None)
        query = last_user.content if last_user else ""
        if last_user:
            db.execute(
                "INSERT INTO chat_messages (session_id, role, content) VALUES (?,?,?)",
                (session_id, "user", query),
            )

    # RAG: semantic first (5s timeout), keyword fallback
    try:
        _, rag_context = await asyncio.wait_for(
            semantic_retrieve(query, body.profile, top_k=3), timeout=5.0
        )
    except asyncio.TimeoutError:
        rag_context = ""
    if not rag_context:
        _, rag_context = retrieve(query, body.profile, top_k=3)

    system_prompt = build_system_prompt(body.profile, rag_context)
    if not has_api_key():
        reply = mock_reply(query)
    else:
        try:
            reply = chat(system_prompt, [m.model_dump() for m in body.messages])
        except Exception:
            reply = mock_reply(query)

    with get_db() as db:
        db.execute(
            "INSERT INTO chat_messages (session_id, role, content) VALUES (?,?,?)",
            (session_id, "assistant", reply),
        )

    return JSONResponse({"reply": reply, "session_id": session_id})
