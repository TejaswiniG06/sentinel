import hashlib
import os
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")


def get_file_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


async def check_virustotal(file_hash: str) -> dict:
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
    headers = {"x-apikey": VT_API_KEY}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:  # 10 second timeout
            response = await client.get(url, headers=headers)
    except httpx.TimeoutException:
        return {"found": False, "timed_out": True}

    if response.status_code == 404:
        return {"found": False, "timed_out": False}

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="VirusTotal API error")

    data = response.json()
    stats = data["data"]["attributes"]["last_analysis_stats"]

    return {
        "found": True,
        "timed_out": False,
        "malicious": stats.get("malicious", 0),
        "suspicious": stats.get("suspicious", 0),
        "harmless": stats.get("harmless", 0),
        "undetected": stats.get("undetected", 0),
    }


@router.post("/scan-file")
async def scan_file(file: UploadFile = File(...)):
    # Limit file size to 32MB
    content = await file.read()

    if len(content) > 32 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 32MB.")

    file_hash = get_file_hash(content)
    vt_result = await check_virustotal(file_hash)

    if not vt_result["found"]:
        if vt_result.get("timed_out"):
            message = "⏱️ Scan timed out. VirusTotal took too long to respond. Try again in a moment."
        else:
            message = "🔍 File not found in VirusTotal database. It may be safe or never scanned before."

        return {
            "filename": file.filename,
            "hash": file_hash,
            "result": "unknown",
            "message": message,
            "stats": None,
        }

    malicious = vt_result["malicious"]
    suspicious = vt_result["suspicious"]

    if malicious > 0:
        result = "malicious"
        message = f"🚨 Malware detected! Flagged by {malicious} out of 70+ antivirus engines."
    elif suspicious > 0:
        result = "suspicious"
        message = f"⚠️ Suspicious file. Flagged by {suspicious} engines as suspicious."
    else:
        result = "clean"
        message = "✅ File appears to be clean. No threats detected."

    return {
        "filename": file.filename,
        "hash": file_hash,
        "result": result,
        "message": message,
        "stats": vt_result,
    }