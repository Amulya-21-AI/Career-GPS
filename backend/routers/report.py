from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..models import ReportRequest
from ..matching import generate_gps_report
from ..ai.prompt import build_system_prompt
from ..ai.provider import chat, has_api_key

router = APIRouter()


@router.post("/report")
def report_endpoint(body: ReportRequest):
    report = generate_gps_report(body.profile)

    if has_api_key():
        top_titles = ", ".join(m.career.title for m in report.topMatches[:3])
        prompt = (
            f"Top career matches: {top_titles}. "
            f"Strengths: {', '.join(report.strengthsDetected[:3])}. "
            f"Key gaps: {', '.join(report.overallGaps[:3])}. "
            "Write a 3-sentence AI summary as their Future Self — honest, specific, motivating."
        )
        try:
            summary = chat(build_system_prompt(body.profile), [{"role": "user", "content": prompt}])
            report = report.model_copy(update={"aiSummary": summary})
        except Exception:
            pass

    return JSONResponse(report.model_dump())
