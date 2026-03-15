from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Scan(BaseModel):
    scan_type: str   # "url", "password", "file"
    result: str      # "safe", "phishing", "suspicious", "breached", "clean", "malicious", "unknown"

class ScoreRequest(BaseModel):
    scans: List[Scan]

def calculate_score(scans: List[Scan]) -> int:
    score = 100

    for scan in scans:
        result = scan.result.lower()
        if result in ["phishing", "malicious"]:
            score -= 25
        elif result == "breached":
            score -= 20
        elif result == "suspicious":
            score -= 10
        elif result in ["safe", "clean"]:
            score += 5

    # Keep score between 0 and 100
    return max(0, min(100, score))

def get_recommendations(scans: List[Scan]) -> List[str]:
    recs = []
    results = [s.result.lower() for s in scans]

    if "breached" in results:
        recs.append("Change your breached password immediately.")
    if "phishing" in results:
        recs.append("Avoid visiting flagged phishing URLs.")
    if "malicious" in results:
        recs.append("Delete any malicious files found on your system.")
    if "suspicious" in results:
        recs.append("Proceed with caution on suspicious URLs or files.")

    # Always show these general tips
    recs.append("Enable two-factor authentication on your accounts.")
    recs.append("Run regular scans on files you download.")

    return recs

@router.post("/score")
def get_score(request: ScoreRequest):
    score = calculate_score(request.scans)
    recommendations = get_recommendations(request.scans)

    total = len(request.scans)
    threats = sum(1 for s in request.scans if s.result.lower() in ["phishing", "malicious", "breached", "suspicious"])
    breached = sum(1 for s in request.scans if s.result.lower() == "breached")

    return {
        "score": score,
        "total_scans": total,
        "threats_found": threats,
        "breached_passwords": breached,
        "recommendations": recommendations,
    }