"""
Seeds all 60 careers from careers.json into the SQLite database.
Run once:  python -m backend.data.seed
"""
import json
from pathlib import Path
import sys, os
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import Column, String, Integer, Text, JSON
from sqlalchemy.orm import declarative_base
from backend.database import engine, Base


class CareerRecord(Base):
    __tablename__ = "careers"
    id                = Column(String, primary_key=True)
    title             = Column(String, nullable=False)
    category          = Column(String)
    type              = Column(String)
    description       = Column(Text)
    day_in_life       = Column(Text)
    required_skills   = Column(JSON)
    nice_to_have_skills = Column(JSON)
    tools             = Column(JSON)
    interests_matched = Column(JSON)
    work_style_fit    = Column(JSON)
    values_fit        = Column(JSON)
    entry_pathways    = Column(JSON)
    beginner_projects = Column(JSON)
    preferred_backgrounds = Column(JSON)
    required_education = Column(JSON)
    timeline_months   = Column(Integer)
    salary_entry      = Column(String)
    salary_mid        = Column(String)
    salary_senior     = Column(String)
    remote_score      = Column(Integer)
    demand_score      = Column(Integer)
    difficulty_score  = Column(Integer)
    risk_score        = Column(Integer)
    growth_potential  = Column(Integer)
    related_careers   = Column(JSON)
    free_resources    = Column(JSON)
    paid_certifications = Column(JSON)
    suited_for        = Column(JSON)
    not_suited_for    = Column(JSON)
    portfolio_ideas   = Column(JSON)


def seed():
    Base.metadata.create_all(bind=engine)
    data_path = Path(__file__).parent / "careers.json"
    with open(data_path, encoding="utf-8") as f:
        careers = json.load(f)

    from sqlalchemy.orm import Session
    with Session(engine) as session:
        existing = {r.id for r in session.query(CareerRecord.id).all()}
        added = 0
        for c in careers:
            if c["id"] in existing:
                continue
            session.add(CareerRecord(
                id=c["id"], title=c["title"], category=c["category"],
                type=c["type"], description=c["description"],
                day_in_life=c["dayInLife"],
                required_skills=c["requiredSkills"],
                nice_to_have_skills=c["niceToHaveSkills"],
                tools=c["tools"], interests_matched=c["interestsMatched"],
                work_style_fit=c["workStyleFit"], values_fit=c["valuesFit"],
                entry_pathways=c["entryPathways"],
                beginner_projects=c["beginnerProjects"],
                preferred_backgrounds=c["preferredBackgrounds"],
                required_education=c["requiredEducation"],
                timeline_months=c["timelineMonths"],
                salary_entry=c["salaryRangeEntry"],
                salary_mid=c["salaryRangeMid"],
                salary_senior=c["salaryRangeSenior"],
                remote_score=c["remoteFriendlyScore"],
                demand_score=c["demandScore"],
                difficulty_score=c["difficultyScore"],
                risk_score=c["riskScore"],
                growth_potential=c["growthPotential"],
                related_careers=c["relatedCareers"],
                free_resources=c["freeResources"],
                paid_certifications=c["paidCertifications"],
                suited_for=c["suitedFor"],
                not_suited_for=c["notSuitedFor"],
                portfolio_ideas=c["portfolioIdeas"],
            ))
            added += 1
        session.commit()
    print(f"Seeded {added} careers into SQLite.")


if __name__ == "__main__":
    seed()
