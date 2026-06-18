import json, re
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..models import InterestTestRequest
from ..ai.prompt import build_system_prompt
from ..ai.provider import chat, has_api_key
from ..database import get_db

router = APIRouter()

MOCK = {
    "interestFit": 7, "skillFit": 5, "disciplineLevel": 6,
    "careerScope": 8, "creativePotential": 7, "riskLevel": 5, "streamAlignment": 7,
    "summary": (
        "Your interests and chosen path are more aligned than you might think. "
        "The biggest opportunity is converting your curiosity into tangible projects."
    ),
}


@router.post("/interest-test")
def interest_test_endpoint(body: InterestTestRequest):
    if not has_api_key():
        return JSONResponse(MOCK)

    qa = "\n\n".join(f"Q: {q}\nA: {a}" for q, a in body.answers.items())
    prompt = (
        f"User completed an interest test:\n\n{qa}\n\n"
        "Score them on 7 dimensions (1-10 each) and give a 2-sentence summary.\n"
        'Return ONLY valid JSON: {"interestFit":7,"skillFit":6,"disciplineLevel":5,'
        '"careerScope":8,"creativePotential":7,"riskLevel":6,"streamAlignment":8,'
        '"summary":"Two sentences."}'
    )
    try:
        result = chat(build_system_prompt(body.profile), [{"role": "user", "content": prompt}])
    except Exception:
        return JSONResponse(MOCK)
    m = re.search(r"\{[\s\S]*\}", result)
    if not m:
        return JSONResponse(MOCK)

    scores = json.loads(m.group())

    with get_db() as db:
        db.execute(
            "INSERT INTO interest_test_results "
            "(user_id, interest_fit, skill_fit, discipline_level, career_scope, "
            "creative_potential, risk_level, stream_alignment, summary) "
            "VALUES (?,?,?,?,?,?,?,?,?)",
            (
                body.user_id,
                scores.get("interestFit", 0),
                scores.get("skillFit", 0),
                scores.get("disciplineLevel", 0),
                scores.get("careerScope", 0),
                scores.get("creativePotential", 0),
                scores.get("riskLevel", 0),
                scores.get("streamAlignment", 0),
                scores.get("summary", ""),
            ),
        )

    return JSONResponse(scores)
