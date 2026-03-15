import re
import os
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class URLRequest(BaseModel):
    url: str

def extract_features(url: str) -> dict:
    return {
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_slashes": url.count("/"),
        "has_https": int(url.startswith("https")),
        "has_ip": int(bool(re.match(r"http[s]?://\d+\.\d+\.\d+\.\d+", url))),
        "num_special_chars": len(re.findall(r"[@#%&=?]", url)),
        "has_suspicious_words": int(
            bool(re.search(r"login|verify|secure|account|update|banking|confirm", url, re.I))
        ),
    }

def rule_based_score(features: dict) -> str:
    score = 0
    if features["url_length"] > 75:       score += 2
    if features["num_dots"] > 4:          score += 2
    if features["has_ip"]:                score += 3
    if features["num_special_chars"] > 3: score += 2
    if features["has_suspicious_words"]:  score += 2
    if not features["has_https"]:         score += 1

    if score >= 5:   return "phishing"
    elif score >= 3: return "suspicious"
    else:            return "safe"

async def check_google_safe_browsing(url: str) -> bool:
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_API_KEY}"
    payload = {
        "client": {"clientId": "sentinel", "clientVersion": "1.0"},
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint, json=payload)
    data = response.json()
    return bool(data.get("matches"))

@router.post("/check-url")
async def check_url(request: URLRequest):
    url = request.url.strip()
    features = extract_features(url)
    ml_result = rule_based_score(features)
    google_flagged = await check_google_safe_browsing(url)

    if google_flagged:
        final_result = "phishing"
    else:
        final_result = ml_result

    messages = {
        "phishing":   "🚨 Dangerous! This URL looks like a phishing attempt.",
        "suspicious": "⚠️ Suspicious. Proceed with caution.",
        "safe":       "✅ This URL appears to be safe.",
    }

    return {
        "url": url,
        "result": final_result,
        "google_flagged": google_flagged,
        "features": features,
        "message": messages[final_result],
    }