from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..models import MatchRequest
from ..matching import generate_matches
from ..database import get_db

router = APIRouter()


@router.post("/match")
def match_endpoint(body: MatchRequest):
    matches = generate_matches(body.profile)

    with get_db() as db:
        for m in matches["top"]:
            db.execute(
                "INSERT INTO career_match_results "
                "(user_id, career_id, career_title, match_score, match_type) "
                "VALUES (?,?,?,?,?)",
                (body.profile.id, m.career.id, m.career.title, m.matchScore, m.matchType),
            )

    return JSONResponse({
        "topMatches":      [m.model_dump() for m in matches["top"]],
        "safeMatches":     [m.model_dump() for m in matches["safe"]],
        "wildcardMatches": [m.model_dump() for m in matches["wildcard"]],
        "stretchMatches":  [m.model_dump() for m in matches["stretch"]],
    })
